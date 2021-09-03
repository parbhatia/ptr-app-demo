const coverpageHeaderLayout = {
  paddingTop: () => -5,
  paddingBottom: () => -5,
  paddingRight: () => 0,
  paddingLeft: () => 0,
  hLineWidth: () => 0,
  vLineWidth: () => 0,
}

const iconWithLabelForCoverpage = ({ iconName, label, link }) => ({
  table: {
    widths: ["auto", "*"],
    // heights: [5, 5],
    headerRows: 1,
    //output tuples
    body: [
      [
        {
          margin: [0, 2],
          image: iconName,
          width: 12,
        },
        {
          text: label,
          style: "coverPageContact",
          link: link ? `https://${link}` : null,
          // margin: [0, 0],
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
})

module.exports = (data) => [
  //coverpage
  {
    table: {
      widths: ["50%", "*"],
      body: [
        [
          {
            image: "ptrLogoSmall",
            width: 225,
            alignment: "center",
          },
          {
            table: {
              widths: "*",
              body: [
                [
                  {
                    table: {
                      body: [
                        [
                          {
                            style: "coverPageMain",
                            text: "HOME",
                          },
                        ],
                      ],
                    },
                    layout: coverpageHeaderLayout,
                  },
                ],
                [
                  {
                    table: {
                      body: [
                        [
                          {
                            style: "coverPageMain",
                            text: "INSPECTION",
                          },
                        ],
                      ],
                    },
                    layout: coverpageHeaderLayout,
                  },
                ],
                [
                  {
                    table: {
                      body: [
                        [
                          {
                            style: "coverPageMain",
                            text: "SERVICES",
                          },
                        ],
                      ],
                    },
                    layout: coverpageHeaderLayout,
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
    //header container layout
    layout: {
      paddingTop: () => 30,
      paddingBottom: () => 10,
      paddingRight: () => 0,
      paddingLeft: () => 0,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
  },
  //coverphoto  table
  {
    table: {
      widths: ["100%"],
      body: [
        [
          {
            image: data.cover_photo,
            fit: [500, 350],
            alignment: "center",
          },
        ],
        [
          {
            table: {
              widths: ["100%"],
              body: [
                [
                  {
                    text: `${data.info.address}, ${data.info.city}`,
                    alignment: "center",
                    style: "coverpageAddressDate",
                  },
                ],
                [
                  {
                    text: data.info.date,
                    alignment: "center",
                    style: "coverpageAddressDate",
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
    layout: "noBorders",
  },

  //contact info
  {
    table: {
      widths: ["*", "50%"],
      body: [
        [
          {
            stack: [
              {
                text: [
                  data.user.firstname + " " + data.user.lastname + " ",
                  {
                    text: data.user.email_signature.nameAdditional,
                    fontSize: 10,
                  },
                ],
                style: "coverPageContact",
              },
              {
                text: data.user.email_signature.namePosition,
                style: "coverPageContact",
              },
              {
                text: process.env.COMPANY_NAME,
                style: "coverPageContact",
              },
              iconWithLabelForCoverpage({
                iconName: "phoneIcon",
                label: data.user.phone_number,
              }),
              iconWithLabelForCoverpage({
                iconName: "mailIcon",
                label: data.user.email,
              }),
              iconWithLabelForCoverpage({
                iconName: "linkIcon",
                label: process.env.WEBSITE.replace(/(^\w+:|^)\/\//, ""), //stripping the https://
                link: process.env.WEBSITE,
              }),
            ],
          },
          {
            image: "caphiLogos",
            width: 250,
          },
        ],
      ],
    },
    // pageBreak: "after",
    layout: {
      paddingTop: () => 30,
      paddingBottom: () => 10,
      paddingRight: () => 0,
      paddingLeft: () => 0,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
  },
]
