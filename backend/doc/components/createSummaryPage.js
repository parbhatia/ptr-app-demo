const isEmpty = require("./isEmpty")
const createPage = require("./createPage")
const createNoteAndHandleNested = require("./createNoteAndHandleNested")
const createOrderedListAndHandleNested = require("./createOrderedListAndHandleNested")
const createSummaryPretext = require("./createSummaryPretext")
const createEmptySummaryText = require("./createEmptySummaryText")

module.exports = (data) =>
  createPage({
    pageHeaderInfo: {
      pageName: "Summary",
      info: data.info,
      uniqueId: data.unique_id,
    },
    content: {
      table: {
        widths: ["100%"],
        headerRows: 0,
        body: [
          [createSummaryPretext],
          [
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 500,
                  y2: 0,
                  dash: {
                    length: 1,
                    space: 1,
                  },
                  lineColor: "lightgrey",
                },
              ],
            },
          ],
          [
            // check empty list
            isEmpty(data.summary.categories[0].checkboxes)
              ? createEmptySummaryText
              : createOrderedListAndHandleNested({
                  itemList: data.summary.categories[0].checkboxes,
                }),
          ],
        ],
      },
      layout: {
        paddingTop: () => 7,
        paddingBottom: () => 5,
        paddingRight: () => 0,
        paddingLeft: () => 0,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    },
  })
