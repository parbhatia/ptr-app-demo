const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:file")
const { Upload } = require("@aws-sdk/lib-storage")
const {
  file: { select, delete_item, update_item, insert_item },
  shareable_link: { update_pdf_last_modified },
} = require("../sql")
const { S3Client } = require("../config/aws")
const { CopyObjectCommand } = require("@aws-sdk/client-s3")
const fs = require("fs")
const { multerTempStorage } = require("../config/multer")
const { mimeTypeToExt } = require("../config/fileUpload")

router.get("/", async (req, res) => {
  const { shareableLinkId, fileType } = req.params
  try {
    const files = await db.any(select, [shareableLinkId, fileType])
    res.send({
      files,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//handles copying from masterfile.
//  is provided with all info of masterfile
router.post("/copy", async (req, res) => {
  const { shareableLinkId, fileType } = req.params
  const { id, name, keyid, extension, size } = req.body
  const s3CopyParams = {
    ACL: process.env.S3_SHAREABLE_FILES_BUCKET_ACL,
    Bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
    CopySource: `${process.env.S3_FILES_BUCKET}/${keyid}`,
    Key: `${shareableLinkId}/${keyid}`,
  }

  try {
    const data = await S3Client.send(new CopyObjectCommand(s3CopyParams))
    const status = data["$metadata"].httpStatusCode
    if (status !== 200) {
      throw new Error("Error copying S3 File")
    }
    //add file to database
    const newFile = await db.one(insert_item, {
      keyid: `${shareableLinkId}/${keyid}`,
      name,
      extension,
      size,
      type: fileType,
      bucket: process.env.S3_SHAREABLE_FILES_BUCKET_NAME,
      shareable_link_id: shareableLinkId,
    })
    if (fileType === "merge_with_pdf") {
      await db.oneOrNone(update_pdf_last_modified, shareableLinkId)
    }
    res.send({ ...newFile })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//add file to db
router.post("/", multerTempStorage.single("files"), async (req, res) => {
  const file = req.file
  debug(file)
  const originalFileName = file.originalname
  let uniqueFileName = JSON.parse(req.body.files).uniqueFileName
  const { shareableLinkId, fileType } = req.params

  //files will be uploaded inside each shareable link's folder, based on shareable link's id
  const keyId = `${shareableLinkId}/${uniqueFileName}`

  try {
    const fileStream = fs.createReadStream(file.path)

    const paralellUploads3 = new Upload({
      client: S3Client,
      params: {
        Bucket: process.env.S3_PHOTOS_BUCKET_NAME,
        Key: keyId,
        Body: fileStream,
        ACL: process.env.S3_PHOTOS_BUCKET_ACL,
        ContentType: file.mimetype,
      },
    })

    await paralellUploads3.done()

    await db.tx(async (t) => {
      await t.one(insert_item, {
        keyid: keyId,
        name: originalFileName,
        extension: mimeTypeToExt[file.mimetype],
        size: file.size,
        type: fileType,
        bucket: process.env.S3_FILES_BUCKET,
        shareable_link_id: shareableLinkId,
      })
      if (fileType === "merge_with_pdf") {
        await t.oneOrNone(update_pdf_last_modified, shareableLinkId)
      }
    })

    res.send(originalFileName)
    //send filename back to filepond client when finished with file
    await fs.promises.unlink(file.path)
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.delete("/:fileId", async (req, res) => {
  const { shareableLinkId, fileType, fileId: id } = req.params
  try {
    const item = await db.one(delete_item, id)
    if (fileType === "merge_with_pdf") {
      await db.oneOrNone(update_pdf_last_modified, shareableLinkId)
    }
    res.send({
      id: item.id,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//update text value
router.patch("/:fileId", async (req, res) => {
  const id = req.params.fileId
  const { name } = req.body
  try {
    const item = await db.one(update_item, [id, name])
    res.send({
      id: item.id,
      name: item.name,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

// //add bulk files to db (legacy code)
// router.post("/", async (req, res) => {
//   try {
//     const { shareableLinkId, fileType } = req.params
//     const { newFiles } = req.body
//     //transform newFiles to ob with database row ids
//     const newRowObj = newFiles.map((file) => ({
//       keyid: file.keyid,
//       name: file.name,
//       extension: file.extension,
//       size: file.size,
//       bucket: process.env.S3_FILES_BUCKET,
//       shareable_link_id: shareableLinkId,
//       type: fileType,
//     }))
//     //defining templates for queries
//     const addFiles = new pgp.helpers.ColumnSet(
//       [
//         "keyid",
//         "name",
//         "extension",
//         "size",
//         "bucket",
//         "shareable_link_id",
//         "type",
//       ],
//       {
//         table: "file",
//       },
//     )
//     await db.tx(async (t) => {
//       const query = pgp.helpers.insert(newRowObj, addFiles) + "RETURNING *"
//       const newItems = await t.map(query, [], (a) => a)
//       if (fileType === "merge_with_pdf") {
//         await t.oneOrNone(update_pdf_last_modified, shareableLinkId)
//       }
//       res.send({
//         newFiles: newItems,
//       })
//     })
//   } catch (e) {
//     debug(e)
//     res.sendStatus(400)
//   }
// })

//Export Router
module.exports.router = router
