const isEmpty = require("./isEmpty")

const iconWithLabelForNotes = ({ iconName, label }) => ({
  table: {
    widths: ["auto", "*"],
    // heights: [5, 5],
    headerRows: 1,
    //output tuples
    body: [
      [
        {
          margin: [0, 0],
          image: iconName,
          width: 15,
        },
        {
          text: label,
          style: "noteMain",
          // margin: [0, 0],
        },
      ],
    ],
  },
  //need this to override right border!
  border: [true, false, false, false],
  layout: {
    paddingTop: () => 0,
    paddingBottom: () => 0,
    paddingLeft: () => 0,
    hLineWidth: () => 0,
    vLineWidth: () => 0,
  },
})

//checks for empty itemList
module.exports = ({ header, itemList }) =>
  isEmpty(itemList)
    ? null
    : {
        table: {
          widths: ["100%"],
          headerRows: 1,
          body: [
            [
              iconWithLabelForNotes({
                iconName: "noteIcon",
                label: header ? header : "Notes",
              }),
            ],
            [
              {
                table: {
                  body: [
                    [
                      {
                        table: {
                          widths: ["auto"],
                          headerRows: 0,
                          body: [
                            [
                              {
                                ol: itemList.map((checkbox) => [
                                  {
                                    text: checkbox.text,
                                    style: "noteComments",
                                  },
                                  //filter empty list
                                  isEmpty(checkbox.subcheckboxes)
                                    ? null
                                    : {
                                        ol: checkbox.subcheckboxes.map(
                                          (subcheckbox) => ({
                                            text: subcheckbox.text,
                                            style: "noteComments",
                                          })
                                        ),
                                        type: "lower-alpha",
                                        margin: [3, 3, 3, 3],
                                        style: "noteComments",
                                      },
                                ]),
                                style: "noteComments",
                              },
                            ],
                          ],
                        },
                        layout: {
                          paddingTop: () => 0,
                          paddingBottom: () => 0,
                          paddingRight: () => 0,
                          paddingLeft: () => 0,
                          hLineWidth: () => 0,
                          vLineWidth: () => 0,
                        },
                      },
                    ],
                  ],
                },
                //need this to override right border!
                border: [true, false, false, false],
                layout: {
                  paddingTop: () => -5,
                  paddingBottom: () => 0,
                  paddingLeft: () => 15,
                  paddingRight: () => 15,
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                },
              },
            ],
          ],
        },
        fillColor: "#fffcc2",
        // describing border here makes no difference!
        // border: [true, true, true, true],
        layout: {
          paddingTop: () => 5,
          paddingBottom: () => 5,
          hLineWidth: () => 0,
          vLineWidth: () => 10,
          // hLineColor: () => "#fffcc2",
          vLineColor: () => "#fff77d",
        },
      }
