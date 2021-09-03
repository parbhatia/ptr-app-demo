module.exports = (category) => ({
  table: {
    widths: ["auto", "*"],
    heights: [5, 5],
    headerRows: 1,
    // output tuples
    body: category.checkboxes.map((ch) => [
      {
        margin: [-5, 1],
        // border: [false, false, false, false],
        image: "checked",
        width: 10,
      },
      {
        text: ch,
        style: "checkboxText",
        margin: [0, 0],
        // border: [false, false, false, false],
      },
    ]),
  },
  layout: {
    paddingTop: () => 0,
    paddingBottom: () => 0,
    paddingLeft: () => 3,
    hLineWidth: () => 0,
    vLineWidth: () => 0,
  },
})
