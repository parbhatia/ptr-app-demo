const isEmpty = require("./isEmpty")
const createSubsectionHeader = require("./createSubsectionHeader")
const createCheckboxes = require("./createCheckboxes")
const createOrderedListAndHandleNested = require("./createOrderedListAndHandleNested")
const createNoteAndHandleNested = require("./createNoteAndHandleNested")
const createSummaryPhotosPairs = require("./createSummaryPhotosPairs")

module.exports = (page) => {
  let pageComments = page.sections[1]
  let pageNotes = page.sections[0]
  let pagePhotos = page.photos
  // //sanity check, making sure we have the correct section
  // if (page.sections[0].name !== "Comments") {
  //   pageComments = page.sections[1]
  //   pageNotes = page.sections[0]
  // }
  return [
    page.subsections.map((subsection) =>
      //only display subsection, if we have a non empty categories list
      isEmpty(subsection.categories)
        ? null
        : {
            table: {
              widths: ["100%"],
              //repeats subsection header to next page on page break
              headerRows: 1,
              body: [
                [createSubsectionHeader({ name: subsection.name })],
                //render categories
                [
                  subsection.categories.map((category) => ({
                    table: {
                      widths: ["100%", "100%"],
                      headerRows: 1,
                      //dont make categories appear on next page on page break! <<-- nvm, do it
                      body: [
                        [
                          {
                            columns: [
                              //category name should take specified width
                              {
                                width: 150,
                                text: `${category.name}: `,
                                style: "categoryText",
                                margin: [0, 0],
                              },
                              //checkboxes can take all the remaining space
                              {
                                width: "*",
                                columns: [createCheckboxes(category)],
                              },
                            ],
                          },
                        ],
                      ],
                    },
                    layout: {
                      paddingTop: () => 0,
                      paddingBottom: () => 0,
                      paddingLeft: () => 0,
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                    },
                  })),
                ],
                [
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 500,
                        y2: 0,
                        dash: { length: 1, space: 5 },
                        lineColor: "grey",
                      },
                    ],
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
    ),
    //render notes, if we have any
    isEmpty(pageNotes.checkboxes)
      ? null
      : {
          table: {
            widths: ["100%"],
            //repeats subsection header to next page on page break
            headerRows: 1,
            body: [
              [
                createSubsectionHeader({
                  name: pageNotes.name,
                }),
              ],
              //render additional note items
              [
                createOrderedListAndHandleNested({
                  itemList: pageNotes.checkboxes,
                }),
              ],
            ],
          },
          layout: "noBorders",
        },
    //render comments
    createNoteAndHandleNested({
      itemList: pageComments.checkboxes,
    }),
    //render notes, if we have any
    isEmpty(pagePhotos)
      ? null
      : {
          stack: [
            [
              createSubsectionHeader({
                name: "Photos",
              }),
            ],
            createSummaryPhotosPairs(pagePhotos),
          ],
        },
  ]
}
