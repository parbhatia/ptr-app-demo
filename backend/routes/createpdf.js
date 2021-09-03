const express = require("express")
const router = express.Router()
const debug = require("debug")("backend:/createpdf")
const { performance } = require("perf_hooks")
const { Readable } = require("stream")
const { pipeline: pipelinePromise } = require("stream/promises")
const logger = require("../logger/winston.js")
const createSession = require("../helpers/createSession")

const { compilePdf } = require("../doc/index")
const parseInspectionData = require("../helpers/parseInspectionData")

// sends progress via componentName
router.post("/", createSession, async (req, res) => {
  const userId = req.headers.user_id
  const sessionId = req.sessionID
  const { inspectionId, pdfRequest, componentName } = req.body
  const socket = req.app.get("inspectionsocket")
  const sendStatus = (progress, label) => {
    socket.emit(`${inspectionId}/${componentName}/progress`, {
      progress,
      label,
    })
  }
  res.type("application/pdf")
  try {
    const start = performance.now()

    sendStatus(30, "Gathering Data")
    // start generation of new PDF
    const inspectionData = await parseInspectionData({
      userId,
      inspectionId,
      pdfRequest,
    })

    const pdfBuffer = await compilePdf(inspectionData)
    sendStatus(60, "Compiling File")
    const pdfBufferSize = Buffer.byteLength(pdfBuffer)
    // convert pdfBuffer to readable stream
    const pdfStream = new Readable({
      read() {
        this.push(pdfBuffer)
        this.push(null)
      },
    })

    await pipelinePromise(pdfStream, res)
    sendStatus(100, "Finished")
    const endTime = performance.now()
    const totalTime = ((endTime - start) / 1000.0).toFixed(2)
    debug(`${sessionId}: Total Time: ${totalTime}s`)
    logger.info(`${sessionId}: Total Time: ${totalTime}s`)
  } catch (e) {
    debug("Create Pdf Error", e)
    res.sendStatus(e)
    logger.error(`Create Pdf Route error. Inspection Id: ${inspectionId}`)
    debug("Pdf Route error", e)
  }
})

// Export Router
module.exports.router = router
