module.exports = ({
  pageName,
  uniqueId,
  info: { address, city },
  isTOC = true,
}) => ({
  table: {
    headerRows: 1,
    widths: ["20%", "60%", "20%"],

    body: [
      [
        {
          image: "headerLogo",
          width: 100,
          alignment: "left",
        },
        [
          {
            text: pageName,
            style: "pageHeaderText",
            tocItem: isTOC,
            //will only apply if TOC is displayed
            tocStyle: "toc",
            tocMargin: [0, 5],
            tocNumberStyle: "tocNumbers",
          },
          {
            table: {
              widths: ["100%"],
              body: [
                [
                  {
                    text: `${address}, ${city}`,
                    style: "pageHeaderTextAddress",
                  },
                ],
              ],
            },
            layout: {
              paddingTop: () => -2,
              paddingBottom: () => 5,
              paddingRight: () => 0,
              paddingLeft: () => 0,
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
          },
        ],
        {
          text: `REPORT #: ${uniqueId}`,
          style: "pageHeaderReportNumber",
          alignment: "right",
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

  colSpan: 1,
})
