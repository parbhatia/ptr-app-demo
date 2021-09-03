const debug = require("debug")("backend:photo")
const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const { S3Client } = require("../config/aws")
const { Upload } = require("@aws-sdk/lib-storage")
const fs = require("fs")
const {
    DeleteObjectCommand,
    PutObjectCommand,
    CopyObjectCommand,
} = require("@aws-sdk/client-s3")
const sharp = require("sharp")
const { multerTempStorage, multerTempBuffer } = require("../config/multer")
const {
    imageResizeWidth,
    HEICOUTPUTFORMAT,
    JPEGQuality,
} = require("../config/fileUpload")
const { generateUniqueId } = require("../helpers/generateUniqueId")
const {
    photo: {
        insert_item,
        select_items,
        delete_item,
        update_item,
        update_caption,
        set_cover_photo,
        update_cdnkey,
        update_versionid,
    },
    abstract_draggable_item: {
        add_order,
        select_order,
        update_order,
        delete_order,
    },
} = require("../sql")

const parentOrderColumnName = "photo_category_id"

//get photos from db
router.get("/", async(req, res) => {
    const photoCategoryId = req.params.photoCategoryId
    try {
        await db.tx(async(t) => {
            const orderInfo = await t.one(select_order, [
                parentOrderColumnName,
                photoCategoryId,
            ])
            const photos = await t.any(select_items, [
                photoCategoryId,
                orderInfo.info,
            ])
            res.send({
                photos,
                orderInfo: orderInfo.info,
            })
        })
    } catch (e) {
        res.sendStatus(400)
    }
})

//add photo to db
router.post("/", multerTempStorage.single("files"), async(req, res) => {
    const file = req.file
    debug(file)
    const originalFileName = file.originalname
    let uniqueFileName = JSON.parse(req.body.files).uniqueFileName
    const needsResize = JSON.parse(req.headers.resize) //boolean
    const photoCategoryId = req.params.photoCategoryId

    try {
        if (file.mimetype == "image/heic") {
            uniqueFileName =
                uniqueFileName.substr(0, uniqueFileName.lastIndexOf(".")) +
                "." +
                HEICOUTPUTFORMAT
        }
        const fileStream = fs.createReadStream(file.path)
        const imageTransformer = sharp()
            .jpeg({ quality: JPEGQuality })
            .resize({
                width: imageResizeWidth,
                options: {
                    withoutEnlargement: true,
                },
            })

        const paralellUploads3 = new Upload({
            client: S3Client,
            params: {
                Bucket: process.env.S3_PHOTOS_BUCKET_NAME,
                Key: uniqueFileName,
                Body: fileStream.pipe(imageTransformer),
                ACL: process.env.S3_PHOTOS_BUCKET_ACL,
            },
        })

        await paralellUploads3.done()

        await db.tx(async(t) => {
            const photo = await db.one(insert_item, {
                keyid: uniqueFileName,
                name: originalFileName,
                photo_category_id: photoCategoryId,
            })
            await db.one(add_order, [
                parentOrderColumnName,
                photoCategoryId,
                photo.id,
            ])
        })
        res.send(originalFileName) //send filename back to filepond client when finished with file
        await fs.promises.unlink(file.path)
    } catch (e) {
        debug(e)
        res.sendStatus(400)
    }
})

//delete photo from photo_category
router.delete("/:photoId", async(req, res) => {
    const photoCategoryId = req.params.photoCategoryId
    const photoId = req.params.photoId
    const { keyid } = req.body
    try {
        const deleteParams = {
            Bucket: process.env.S3_PHOTOS_BUCKET_NAME,
            Key: keyid,
        }
        await S3Client.send(new DeleteObjectCommand(deleteParams))
        await db.tx(async(t) => {
            const photo = await t.one(delete_item, photoId)
            const newOrderInfo = await t.one(delete_order, [
                parentOrderColumnName,
                photoCategoryId,
                parseInt(photoId),
            ])
            res.send({
                photo: photo,
                orderInfo: newOrderInfo.info,
            })
        })
    } catch (e) {
        res.sendStatus(400)
    }
})

//delete photo VERSION from photo_category
router.patch("/deleteVersion/:photoId", async(req, res) => {
    const photoId = req.params.photoId
    const photoCategoryId = req.params.photoCategoryId
    const { keyid, versionid, type } = req.body
    if (!versionid) {
        throw new Error("No versionid specified")
    }
    try {
        const deleteParams = {
            Bucket: process.env.S3_PHOTOS_BUCKET_NAME,
            Key: keyid,
            VersionId: versionid,
        }
        await S3Client.send(new DeleteObjectCommand(deleteParams))

        let cdnKeyId = null
        if (type === "cover_photo") {
            //update cdn with new photo, the one that preceeds the one with the versionid
            //append photo category id in front, since it's a unique identifier to an inspection
            cdnKeyId = `coverPhotos/${photoCategoryId}/${generateUniqueId()}`
            const s3CopyParams = {
                ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
                Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
                CopySource: `${process.env.S3_PHOTOS_BUCKET_NAME}/${keyid}`,
                Key: cdnKeyId,
            }
            const s3Response = await S3Client.send(
                new CopyObjectCommand(s3CopyParams),
            )
            const status = s3Response["$metadata"].httpStatusCode
            if (status !== 200) {
                throw new Error("Error copying S3 CDN File")
            }
        }

        const photo = await db.one(update_item, [photoId, versionid, cdnKeyId])
        res.send({
            photo,
        })
    } catch (e) {
        debug("Error", e)
        res.sendStatus(400)
    }
})

//update photo_category order
router.patch("/update", async(req, res) => {
    const photoCategoryId = req.params.photoCategoryId
    const { newOrderInfo } = req.body
    try {
        const returnedInfo = await db.one(update_order, [
            parentOrderColumnName,
            photoCategoryId,
            newOrderInfo,
        ])
        res.send({
            orderInfo: returnedInfo.info,
        })
    } catch (e) {
        res.sendStatus(400)
    }
})

//update photo's caption
router.patch("/updateCaption/:photoId", async(req, res) => {
    const photoId = req.params.photoId
    const { caption } = req.body
    try {
        const photo = await db.one(update_caption, [photoId, caption])
        res.send({
            photo,
        })
    } catch (e) {
        res.sendStatus(400)
    }
})

// set cover photo
router.patch("/setCoverPhoto/:photoId", async(req, res) => {
    const photoId = req.params.photoId
    const { keyid } = req.body
    const photoCategoryId = req.params.photoCategoryId
    try {
        await db.tx(async(t) => {
            //delete previous cdn_key that was stored
            await t.oneOrNone(update_cdnkey, photoCategoryId)

            //append photo category id in front, since it's a unique identifier to an inspection
            // *** Not adding keyid in the filename, this led to issues in NEXTJS image optimization.
            // When issues get resolved, add keyid to end of cdnKeyId to retain the original extension!
            // *** Right now, cdnKeyId is extensionless, meaning it will upload with a mimetype of octet/stream
            const cdnKeyId = `coverPhotos/${photoCategoryId}/${generateUniqueId()}${keyid}`
                //copy to CDN
            const s3CopyParams = {
                ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
                Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
                CopySource: `${process.env.S3_PHOTOS_BUCKET_NAME}/${keyid}`,
                Key: cdnKeyId,
            }
            const s3Response = await S3Client.send(
                new CopyObjectCommand(s3CopyParams),
            )
            const status = s3Response["$metadata"].httpStatusCode
            if (status !== 200) {
                throw new Error("Error copying S3 CDN File")
            }

            const photo = await t.one(set_cover_photo, [photoId, cdnKeyId])

            res.send({
                photo,
            })
        })
    } catch (e) {
        res.sendStatus(400)
    }
})

//save marker js photo using multer
router.post(
    "/saveMarkedFile/:photoId",
    multerTempBuffer.single("image"),
    async(req, res) => {
        const photoCategoryId = req.params.photoCategoryId
        const photoId = req.params.photoId
        const { keyid, type } = req.body
        const file = req.file
        try {
            const s3UploadParams = {
                Bucket: process.env.S3_PHOTOS_BUCKET_NAME,
                Key: keyid,
                Body: file.buffer,
                ACL: process.env.S3_PHOTOS_BUCKET_ACL,
                ContentType: file.mimetype,
            }
            const { VersionId: versionId } = await S3Client.send(
                new PutObjectCommand(s3UploadParams),
            )

            let cdnKeyId = null
                //if photo ends up not being cover_photo, assigning null value to cdn_keyid in db is okay
            if (type === "cover_photo") {
                //append photo category id in front, since it's a unique identifier to an inspection
                cdnKeyId = `coverPhotos/${photoCategoryId}/${generateUniqueId()}`
                    //update cdn with new photo
                const s3CopyParams = {
                    ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
                    Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
                    CopySource: `${process.env.S3_PHOTOS_BUCKET_NAME}/${keyid}`,
                    Key: cdnKeyId,
                }
                const s3Response = await S3Client.send(
                    new CopyObjectCommand(s3CopyParams),
                )
                const status = s3Response["$metadata"].httpStatusCode
                if (status !== 200) {
                    throw new Error("Error copying S3 CDN File")
                }
            }

            const photo = await db.one(update_versionid, [
                photoId,
                versionId,
                cdnKeyId,
            ])
            res.send({
                photo,
            })
        } catch (e) {
            res.sendStatus(400)
        }
    },
)

// //add bulk photos to db (legacy code)
// router.post("/", async (req, res) => {
//   const photoCategoryId = req.params.photoCategoryId
//   const { newPhotos } = req.body
//   //transform newPhotos to ob with database row ids
//   const formattedRow = newPhotos.map((p) => ({
//     keyid: p.keyid,
//     name: p.name,
//     photo_category_id: photoCategoryId,
//   }))
//   //defining templates for queries
//   const addPhotos = new pgp.helpers.ColumnSet(
//     ["keyid", "name", "photo_category_id"],
//     {
//       table: "photo",
//     },
//   )
//   try {
//     await db.tx(async (t) => {
//       const query = pgp.helpers.insert(formattedRow, addPhotos) + "RETURNING *"
//       const newItems = await t.map(query, [], (a) => a)
//       const flattenedIdArray = newItems.map((ob) => ob.id)
//       //append this array to order_info's info column
//       const newOrderInfo = await t.one(
//         "update order_info set info = array_cat(info, $2) where photo_category_id = $1 returning info;",
//         [photoCategoryId, flattenedIdArray],
//       )
//       res.send({
//         newPhotos: newItems,
//         orderInfo: newOrderInfo.info,
//       })
//     })
//   } catch (e) {
//     res.sendStatus(400)
//   }
// })

//Export Router
module.exports.router = router