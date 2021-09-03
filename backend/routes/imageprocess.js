const express = require("express")

const router = express.Router()
const debug = require("debug")("backend:/imageprocess")
const sharp = require("sharp")
debug("Sharp imported successfully!")
const { GetObjectCommand } = require("@aws-sdk/client-s3")
const logger = require("../logger/winston.js")
const { S3Client } = require("../config/aws")

router.post("/:resize", async(req, res) => {
    const { keyid, defaultCoverPhoto, width, legacy } = req.body
    const s3GetParams = {
        Bucket: legacy ?
            process.env.S3_PHOTOS_BUCKET_NAME :
            process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
        Key: defaultCoverPhoto ? "assets/coverPhoto.jpg" : keyid,
    }
    try {
        const s3File = await S3Client.send(new GetObjectCommand(s3GetParams))
        const s3ImageStream = s3File.Body
        const imageTransformer = sharp().resize(width).jpeg({ progressive: true })
            // don't use pipeline, since we're aborting streams from frontend on component unmount,
            //   that causes stream.end() to be called twice, which leads to nodejs errors/crashes
        s3ImageStream
            .pipe(imageTransformer)
            .on("error", (err) => {
                debug("err!", err)
                res.end(err)
                imageTransformer.end()
            })
            .pipe(res)
            .on("error", (err) => {
                res.end(err)
                imageTransformer.end()
                s3File.end()
            })
    } catch (e) {
        debug("Error getting cover photo", e)
        res.sendStatus(400)
    }
})

// Export Router
module.exports.router = router