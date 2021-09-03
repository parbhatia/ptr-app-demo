const createPageHeader = require("./createPageHeader")

module.exports = (data) => ({
  table: {
    widths: ["100%"],
    headerRows: 1,
    body: [
      [
        createPageHeader({
          pageName: "Table of Contents",
          uniqueId: data.unique_id,
          info: {
            address: data.info.address,
            city: data.info.city,
          },
          isTOC: false,
        }),
      ],
      [
        {
          toc: {},
        },
      ],
    ],
  },
  layout: {
    paddingTop: () => 20,
    paddingBottom: () => 0,
    paddingRight: () => 10,
    paddingLeft: () => 10,
    hLineWidth: () => 0,
    vLineWidth: () => 0,
  },
  pageBreak: "before",
})
