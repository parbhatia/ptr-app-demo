const debug = require("debug")("backend:/generateEmailFields")
const sanitizeFilename = require("sanitize-filename")

module.exports = {
  generateSubject: (address) => {
    const sanitizedAddress = sanitizeFilename(address)
    const parsedAddress = sanitizedAddress
      .trim()
      .replace(/[^a-z0-9A-Z]/gi, " ")
      // remove all occurences of more than 2 "-"
      .replace(/\-{2,}/g, " ")
      // replace last "-" if exists
      .replace(/\-$/, "")
      .trim()
    const generatedSubject = `Inspection Package - ${parsedAddress}`
    return generatedSubject
  },
  generateMessage: () => {
    return `Regards, please find the PDF report, and any additional attachments inside the inspection package.\nPlease feel free to call if you have any questions or concerns.\nThanks for choosing ${process.env.COMPANY_NAME}.`
  },
}
