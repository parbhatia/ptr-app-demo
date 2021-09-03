const debug = require("debug")("backend:/generateInspectionFileName")
const sanitizeFilename = require("sanitize-filename")

// given required info, generates name of Pdf file to be used
module.exports = (uniqueId, address, pdfRequest) => {
  const fileName =
    pdfRequest === "summary"
      ? `Summary - ${address}`
      : `FullReport - ${address}`
  const sanitizedFileName = sanitizeFilename(fileName)
  const parsedFileName = `${sanitizedFileName
    .trim()
    .replace(/[^a-z0-9A-Z]/gi, "-")
    // remove all occurences of more than 2 "-"
    .replace(/\-{2,}/g, "-")
    // replace last "-" if exists
    .replace(/\-$/, "")
    .trim()}`
  return parsedFileName
}
