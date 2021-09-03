const createPage = require("./createPage")
const createNoteAndHandleNested = require("./createNoteAndHandleNested")
const createOrderedListAndHandleNested = require("./createOrderedListAndHandleNested")

module.exports = (data) =>
  createPage({
    pageHeaderInfo: {
      pageName: "Additional Notes",
      info: data.info,
      uniqueId: data.unique_id,
    },
    content: {
      table: {
        widths: ["100%"],
        headerRows: 0,
        body: [
          [
            createNoteAndHandleNested({
              header: "Inquire from the vendor about:",
              itemList: data.summary.categories[2].checkboxes,
            }),
          ],
          [
            createOrderedListAndHandleNested({
              itemList: data.summary.categories[1].checkboxes,
            }),
          ],
        ],
      },
      layout: {
        paddingTop: () => 10,
        paddingBottom: () => 5,
        paddingRight: () => 0,
        paddingLeft: () => 0,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    },
  })
