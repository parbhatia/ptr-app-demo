const debug = require("debug")("backend:/updatePdfRecord")
const db = require("../config/db")

// creates pdf record in db
module.exports = async ({ keyId, versionId, pdfRequest, inspectionId }) => {
  const newPdf = await db.one(
    "insert into pdf(key_id, version_id, type, inspection_id) VALUES ($1, $2, $3, $4) returning *;",
    [keyId, versionId, pdfRequest, inspectionId],
  )
  return newPdf
}
