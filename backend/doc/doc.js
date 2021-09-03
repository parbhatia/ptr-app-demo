const debug = require("debug")("pdfmake:doc")
const styles = require("./styles")
const createTOC = require("./components/createTOC")
const createCoverPage = require("./components/createCoverPage")
const createPhotosPage = require("./components/createPhotosPage")
const createInspectionPages = require("./components/createInspectionPages")
const createSummaryAdditionalNotes = require("./components/createSummaryAdditionalNotes")
const createSummaryPage = require("./components/createSummaryPage")
const createFooter = require("./components/createFooter")
const isEmpty = require("./components/isEmpty")

const createDoc = (data) => {
  const onlySummary = data.pdfRequest === "summary"
  const noPhotos = isEmpty(data.summary.photos)
  const fullName = data.user.firstname + " " + data.user.lastname
  return {
    info: {
      title: "Inspection Report",
      author: fullName,
      subject: `Inspection Report - ${data.info.address}`,
      creator: fullName,
      producer: process.env.COMPANY_NAME,
      keywords: "Inspection Report",
    },
    pageMargins: [50, 10, 50, 30],
    pageSize: "Letter",
    content: [
      createCoverPage(data),
      onlySummary ? null : createTOC(data),
      createSummaryPage(data),
      createSummaryAdditionalNotes(data),
      noPhotos ? null : createPhotosPage(data),
      onlySummary ? null : createInspectionPages(data),
    ],
    footer: createFooter,
    images: {
      checked: require("./base64assets/checkbox-big"),
      phoneIcon: require("./base64assets/phone"),
      linkIcon: require("./base64assets/link"),
      mailIcon: require("./base64assets/mail"),
      ptrLogoSmall: require("./base64assets/PTRLOGOSM"),
      caphiLogos: require("./base64assets/caphiLogos"),
      noteIcon: require("./base64assets/note"),
      headerLogo: require("./base64assets/headerLogo"),
    },
    defaultStyle: {
      font: "SourceSans",
      // fontSize: 14,
    },
    styles,
  }
}

module.exports.createDoc = createDoc
