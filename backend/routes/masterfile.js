const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:master_file")
const { Upload } = require("@aws-sdk/lib-storage")
const {
  file: { delete_item, update_item },
  master_file: { select, insert_item },
} = require("../sql")
const { multerTempStorage } = require("../config/multer")
const { S3Client } = require("../config/aws")
const { mimeTypeToExt } = require("../config/fileUpload")
const fs = require("fs")

router.get("/", async (req, res) => {
  const masterFileStoreId = req.params.masterFileStoreId
  try {
    const files = await db.any(select, masterFileStoreId)
    res.send({
      files,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//add master file to db
router.post("/", multerTempStorage.single("files"), async (req, res) => {
  const file = req.file
  debug(file)
  const originalFileName = file.originalname
  let uniqueFileName = JSON.parse(req.body.files).uniqueFileName
  const masterFileStoreId = req.params.masterFileStoreId

  try {
    const fileStream = fs.createReadStream(file.path)

    const paralellUploads3 = new Upload({
      client: S3Client,
      params: {
        Bucket: process.env.S3_FILES_BUCKET,
        Key: uniqueFileName,
        Body: fileStream,
        ContentType: file.mimetype,
      },
    })

    await paralellUploads3.done()

    await db.one(insert_item, {
      keyid: uniqueFileName,
      name: originalFileName,
      extension: mimeTypeToExt[file.mimetype],
      size: file.size,
      bucket: process.env.S3_FILES_BUCKET,
      master_file_store_id: masterFileStoreId,
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
  const id = req.params.fileId
  try {
    const item = await db.one(delete_item, id)
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
//     const masterFileStoreId = req.params.masterFileStoreId
//     const { newFiles } = req.body
//     //transform newFiles to ob with database row ids
//     const newRowObj = newFiles.map((file) => ({
//       keyid: file.keyid,
//       name: file.name,
//       extension: file.extension,
//       size: file.size,
//       bucket: process.env.S3_FILES_BUCKET,
//       master_file_store_id: masterFileStoreId,
//     }))
//     //defining templates for queries
//     const addFiles = new pgp.helpers.ColumnSet(
//       ["keyid", "name", "extension", "size", "bucket", "master_file_store_id"],
//       {
//         table: "file",
//       },
//     )
//     await db.tx(async (t) => {
//       const query = pgp.helpers.insert(newRowObj, addFiles) + "RETURNING *"
//       const newItems = await t.map(query, [], (a) => a)
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
