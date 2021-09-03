const isEmpty = require("./isEmpty")
//checks for empty lists 2 levels deep
module.exports = ({ itemList }) =>
  isEmpty(itemList)
    ? null
    : {
        ol: itemList.map((checkbox) => [
          {
            text: checkbox.text,
            style: "summaryText",
            margin: [0, 3, 0, 0],
          },
          //filter empty list
          isEmpty(checkbox.subcheckboxes)
            ? null
            : {
                ol: checkbox.subcheckboxes.map((subcheckbox) => ({
                  text: subcheckbox.text,
                  style: "summaryText",
                })),
                type: "lower-alpha",
                style: "summaryText",
                margin: [10, 3],
              },
        ]),
        style: "summaryText",
      }
