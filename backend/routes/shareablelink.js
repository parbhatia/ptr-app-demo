const express = require("express")
const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:shareablelink")
const db = require("../config/db")
const { performance } = require("perf_hooks")
const { file, dir } = require("tmp-promise")
const { Readable } = require("stream")
const { pipeline: pipelinePromise } = require("stream/promises")
const {
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3")
const { S3Client } = require("../config/aws")
const logger = require("../logger/winston.js")
const createSession = require("../helpers/createSession")
const fs = require("fs")
const { compilePdf } = require("../doc/index")
const parseInspectionData = require("../helpers/parseInspectionData")
const compressFile = require("../helpers/compressFile")
const mergePdfs = require("../helpers/mergePdfs")
const {
    generateUniqueId,
    generateFileName,
} = require("../helpers/generateUniqueId")
const path = require("path")
const {
    shareable_link: {
        select,
        select_for_public,
        fetch_pdf,
        delete_pdf,
        increment_view_count,
        update_access_control,
    },
    file: { insert_item, select: select_files },
} = require("../sql")


router.get("/fromPublic", async(req, res) => {
    res.redirect("/error.html")
})

router.get("/fromPublic/:queryId", async(req, res) => {
    const { queryId } = req.params

    try {
        const shareablelink = await db.oneOrNone(select_for_public, queryId)
        await db.one(increment_view_count, queryId)
            // debug(shareablelink)
        res.send({
            payload: shareablelink,
        })
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

router.get("/:shareableLinkId", async(req, res) => {
    const { shareableLinkId } = req.params
    try {
        const shareablelink = await db.one(select, shareableLinkId)
        res.send({
            shareablelink,
        })
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

router.use("/:shareableLinkId/emailrecords", require("./emailrecords").router)

//update access control
router.patch("/:shareableLinkId/accessControl", async(req, res) => {
    const { shareableLinkId } = req.params
    const { boolVal } = req.body
    try {
        const shareableLink = await db.one(update_access_control, [
            shareableLinkId,
            boolVal,
        ])
        res.send({ shareableLink })
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

router.get("/:shareableLinkId/fetchpdf", async(req, res) => {
    const { shareableLinkId } = req.params
    try {
        const pdf = await db.oneOrNone(fetch_pdf, shareableLinkId)
        res.send({
            pdf,
        })
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

const getS3Object = (keyid) => {
    return new Promise((resolve, reject) => {
        const getObjParams = {
            Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
            Key: keyid,
        }
        S3Client.send(new GetObjectCommand(getObjParams))
            .then((data) => resolve(data.Body))
            .catch((error) => {
                console.error(error)
                reject(error)
            })
    })
}

const saveS3FileToDisk = (stream, dirPath) => {
    const tempFileName = generateUniqueId() + ".pdf"
    const tmpFilePath = path.join(dirPath, tempFileName)
    return pipelinePromise(stream, fs.createWriteStream(tmpFilePath))
        .then(() => tmpFilePath)
        .catch(debug)
}

// sends progress via componentName
router.post("/:shareableLinkId/createPdf", createSession, async(req, res) => {
    const { shareableLinkId, inspectionId } = req.params
    const userId = req.headers.user_id
    const sessionId = req.sessionID
    const { pdfRequest, componentName, deletePreviousFile } = req.body
    const socket = req.app.get("inspectionsocket")
    const sendStatus = (progress, label) => {
            socket.emit(`${inspectionId}/${componentName}/progress`, {
                progress,
                label,
            })
        }
        //create temp folder to download s3 files to
    const { path: dirPath, cleanup: cleanupTempOutputDir } = await dir({
        unsafeCleanup: true,
    })

    // create tmp filepath for merge
    const { path: mergedFilePath, cleanup: cleanupTempOutputFile1 } = await file()

    // create tmp filepath for compression
    const { path: compressedFileOutputPath, cleanup: cleanupTempOutputFile2 } =
    await file()

    // create tmp filepath for saving s3 Buffer
    const { path: s3FilePath, cleanup: cleanupTempOutputFile3 } = await file()

    try {
        const start = performance.now()
        sendStatus(10, "Gathering Data")

        //get s3 keyids of files requested to be merged
        const filesToMerge = await db.any(select_files, [
            shareableLinkId,
            "merge_with_pdf",
        ])
        const mergePromises = filesToMerge.map((f) => getS3Object(f.keyid))

        const streamArray = await Promise.all(mergePromises)
        const writeToFilePromises = streamArray.map((stream) => {
            if (stream.statusCode === 200) {
                return saveS3FileToDisk(stream, dirPath)
            } else {
                throw new Error("Unable to get S3 File")
            }
        })
        const writeToFileResults = await Promise.all(writeToFilePromises)
        const tmpMergeFilePaths = writeToFileResults

        // start generation
        const inspectionData = await parseInspectionData({
            userId,
            inspectionId,
            pdfRequest,
        })

        const { fileName } = inspectionData
        const uniqueKeyId = generateFileName() + ".pdf"
        const pdfBuffer = await compilePdf(inspectionData)

        // convert pdfBuffer to readable stream
        const pdfStream = new Readable({
            read() {
                this.push(pdfBuffer)
                this.push(null)
            },
        })

        // write stream to file
        await pipelinePromise(pdfStream, fs.createWriteStream(s3FilePath))

        const fulfillMergeRequests = tmpMergeFilePaths.length !== 0
        let compressedFileInputPath = s3FilePath

        if (fulfillMergeRequests) {
            sendStatus(30, "Merging Files")
                // add filepath to front
            tmpMergeFilePaths.unshift(s3FilePath)
                // change input file path for compression function
            compressedFileInputPath = mergedFilePath
                // merge files. [pdf1, pdf2,...,pdfn] -> mergedfile
            await mergePdfs(tmpMergeFilePaths, mergedFilePath)
        }

        sendStatus(50, "Compressing File")
            // compress temp pdf file, and get back a ReadStream
        const { stream: readableCompressedPdfStream, fileSize: contentLength } =
        await compressFile(
            sessionId,
            compressedFileInputPath,
            compressedFileOutputPath,
        )

        sendStatus(70, "Saving to Cloud")
        const s3UploadParams = {
            ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
            Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
            Key: `${shareableLinkId}/${uniqueKeyId}`,
            Body: readableCompressedPdfStream,
            ContentLength: contentLength,
            ContentType: "application/pdf",
        }

        const starts3Time = performance.now()
            // Stream to s3
        const { VersionId: versionId } = await S3Client.send(
            new PutObjectCommand(s3UploadParams),
        )
        sendStatus(100, "Saving to Cloud")
        const ends3Time = performance.now()

        //delete old pdf file from shareable link
        if (deletePreviousFile) {
            debug("Deleting previous shareable link pdf")
            const deletedFile = await db.one(delete_pdf, shareableLinkId)
            debug({ deletedFile })
        }

        // store created pdf file in db
        const newFile = await db.one(insert_item, {
            keyid: `${shareableLinkId}/${uniqueKeyId}`,
            name: fileName,
            versionid: versionId,
            extension: "pdf",
            size: contentLength,
            type: "pdf",
            bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
            shareable_link_id: shareableLinkId,
        })

        debug({ newFile })

        res.sendStatus(200)

        cleanupTempOutputFile1()
        cleanupTempOutputFile2()
        cleanupTempOutputFile3()
        cleanupTempOutputDir()

        const totalTimeS3 = ((ends3Time - starts3Time) / 1000.0).toFixed(2)
        debug(`${sessionId}: S3 upload ${fileName} took ${totalTimeS3}s`)
        logger.info(`${sessionId}: S3 upload ${fileName} took ${totalTimeS3}s`)

        const endTime = performance.now()
        const totalTime = ((endTime - start) / 1000.0).toFixed(2)
        debug(`${sessionId}: Total Time: ${totalTime}s`)
        logger.info(`${sessionId}: Total Time: ${totalTime}s`)
    } catch (e) {
        cleanupTempOutputFile1()
        cleanupTempOutputFile2()
        cleanupTempOutputFile3()
        cleanupTempOutputDir()

        debug("Pdf Route error", e)
            // socket.emit(`${inspectionId}/${componentName}/resetState`, "true")
        res.send(e)
        logger.error(
            `Shareable Link Pdf Route error. Inspection Id: ${inspectionId}`,
        )
    }
})

router.use("/:shareableLinkId/:fileType/file", require("./file").router)
router.use("/:shareableLinkId/sendemail", require("./sendemail").router)

module.exports.router = router