const multer = require("multer")
const multerLimits = {
  //   files: 1, // allow 1 file per request
  fileSize: 1024 * 1024 * 5, // 5 MB (max file size)
}

const multerTempStorage = multer({ dest: "/tmp", limits: multerLimits })

const multerTempBuffer = multer({})

exports.multerLimits = multerLimits
exports.multerTempStorage = multerTempStorage
exports.multerTempBuffer = multerTempBuffer
