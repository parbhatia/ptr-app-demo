const debug = require("debug")("pdfmake:index")
const PdfPrinter = require("pdfmake")
const { performance } = require("perf_hooks")
const { createDoc } = require("./doc")
const fonts = require("./fonts")

// promise which returns buffer of pdf doc
const docToBuffer = async (PdfKitDocument) =>
  new Promise((resolve, reject) => {
    try {
      const chunks = []
      PdfKitDocument.on("data", (chunk) => chunks.push(chunk))
      PdfKitDocument.on("end", async () => {
        resolve(Buffer.concat(chunks))
      })
      PdfKitDocument.end()
    } catch (err) {
      reject(err)
    }
  })

const compilePdf = async (data) => {
  const start = performance.now()
  const docDefinition = await createDoc(data)
  const printer = await new PdfPrinter(fonts)
  // pdfDoc is a WritableStream
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  // await saveLocally(pdfDoc, outputPath)
  const end = performance.now()
  const totalTime = ((end - start) / 1000.0).toFixed(2)
  debug(`PDF Compile: ${totalTime}s`)
  return docToBuffer(pdfDoc)
}

module.exports.compilePdf = compilePdf
