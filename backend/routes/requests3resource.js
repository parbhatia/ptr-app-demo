const express = require("express")
const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:requests3resource")
const { S3Client } = require("../config/aws")
const { GetObjectCommand } = require("@aws-sdk/client-s3")

const sharp = require("sharp")
const { Readable } = require("stream")
const { pipeline: pipelinePromise } = require("stream/promises")

router.get("/file", async(req, res) => {
    try {
        const { type, keyid } = req.query
        if (type === "shareable") {
            res.send(process.env.S3_CDN_URL + "/" + keyid)
        } else if (type === "private") {
            res.send(process.env.S3_FILES_BUCKET_RESOURCE_URL + "/" + keyid)
        } else {
            throw new Error("Unknown file request.")
        }
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

router.get("/streamfile", async(req, res) => {
    const { type, keyid } = req.query
    try {
        let bucket
        if (type === "shareable") {
            bucket = process.env.S3_SHAREABLE_FILES_BUCKET_NAME
        } else if (type === "private") {
            bucket = process.env.S3_FILES_BUCKET
        } else {
            throw new Error("Unknown file request.")
        }
        const getObjParams = {
            Bucket: bucket,
            Key: keyid,
        }
        const s3File = await S3Client.send(new GetObjectCommand(getObjParams))
        const s3Stream = s3File.Body
        s3Stream.pipe(res).on("error", (err) => {
            res.end(err)
        })
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const data = []

        stream.on("data", (chunk) => {
            data.push(chunk)
        })

        stream.on("end", () => {
            resolve(Buffer.concat(data))
        })

        stream.on("error", (err) => {
            reject(err)
        })
    })
}

router.get("/pdfthumbnail", async(req, res) => {
    const { type, keyid } = req.query
        // debug("received:", type, keyid)
    try {
        let bucket
        if (type === "shareable") {
            bucket = process.env.S3_SHAREABLE_FILES_BUCKET_NAME
        } else if (type === "private") {
            bucket = process.env.S3_FILES_BUCKET
        } else {
            throw new Error("Unknown file request.")
        }
        const getObjParams = {
            Bucket: bucket,
            Key: keyid,
        }
        const s3File = await S3Client.send(new GetObjectCommand(getObjParams))
        const s3ImageStream = s3File.Body
        const bufs = await streamToBuffer(s3ImageStream)

        const imgbuffer = await sharp(bufs, {
                pages: 1,
                page: 0,
            })
            .resize({
                width: 200,
                options: {
                    withoutEnlargement: true,
                },
            })
            .jpeg({
                quality: 80,
                options: {
                    progressive: true,
                },
            })
            .toBuffer()

        const sharpStream = Readable.from(imgbuffer)
        await pipelinePromise(sharpStream, res)
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

module.exports.router = router