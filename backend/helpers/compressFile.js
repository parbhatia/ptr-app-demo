const debug = require("debug")("backend:compressFile")
const util = require("util")
const exec = util.promisify(require("child_process").exec)
const fs = require("fs")
const { performance } = require("perf_hooks")
const logger = require("../logger/winston.js")

// compresses file using ghostscript, and return a ReadStream from it
module.exports = async (sessionId, filePath, outputFilePath) => {
  try {
    const start = performance.now()
    const { stderr } = await exec(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer -dDetectDuplicateImages=true -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${filePath}`,
    )
    if (stderr !== "") {
      throw new Error("Ghostscript Error")
    } else {
      const end = performance.now()
      const totalTime = Math.round((end - start) / 1000.0)

      // get size of compressed pdf
      const { size } = await fs.promises.stat(outputFilePath)
      const prettySize = (size / 1000000.0).toFixed(2)

      logger.info(`${sessionId}: Compression Function: ${totalTime}s`)
      debug(`${sessionId}: Compression Function: ${totalTime}s`)
      logger.info(`${sessionId}: Compressed PDF Size: ${prettySize} MB`)
      debug(`${sessionId}: Compressed PDF Size: ${prettySize} MB`)
      return {
        stream: fs.createReadStream(outputFilePath),
        fileSize: size,
      }
    }
  } catch (e) {
    debug("Error Compressing PDF", e)
    logger.error(`${sessionId}: Compression failed!`)
  }
}
