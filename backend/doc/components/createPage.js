//requires pagename and content to be provided
const createPageHeader = require("./createPageHeader")
module.exports = ({ pageHeaderInfo, content }) => {
  return {
    table: {
      widths: ["100%"],
      headerRows: 1,
      body: [
        //page header
        [createPageHeader(pageHeaderInfo)],
        [content],
      ],
    },
    layout: "noBorders",
    pageBreak: "before",
  }
}
