const nanoid = require("nanoid")

const generateUniqueId = nanoid.customAlphabet(
  "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789",
  10,
)

const generateInspectionId = nanoid.customAlphabet(
  "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
  6,
)

const generateFileName = nanoid.customAlphabet(
  "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
  6,
)

exports.generateUniqueId = generateUniqueId
exports.generateInspectionId = generateInspectionId
exports.generateFileName = generateFileName
