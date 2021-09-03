const debug = require("debug")("backend:mergePdfs")
const pdftk = require("node-pdftk")

// merges all filePaths in inputArray and outputs it to specified path
module.exports = async (inputArray, tmpFilePath) => {
  const inputArrayObject = {}
  inputArray.forEach((filePath, i) => {
    const letter = String.fromCharCode("A".charCodeAt() + i)
    inputArrayObject[letter] = filePath
  })
  return pdftk.input(inputArrayObject).cat().output(tmpFilePath)
  // .catch((err) => {
  //   debug("PDFTK Error", err)
  // })
}
