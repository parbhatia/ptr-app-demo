const photoCaptionLayout = {
  paddingTop: () => 0,
  paddingBottom: () => 0,
  paddingRight: () => 0,
  paddingLeft: () => 0,
  hLineWidth: () => 0,
  vLineWidth: () => 0,
}

const renderCaption = (caption) => [
  {
    text: caption,
    width: 250,
    alignment: "center",
    style: "summaryPhotoCaption",
  },
]
const renderPhoto = (src) => [
  {
    image: src,
    width: 250,
    alignment: "center",
  },
]

const renderPhotoAndCaption = (src, caption) => {
  if (caption) {
    return [renderPhoto(src), renderCaption(caption)]
  } else {
    return [renderPhoto(src)]
  }
}

module.exports = (photos) => {
  let allPairs = []

  for (let i = 0; i < photos.length; i += 2) {
    //if second last element
    if (i === photos.length - 1) {
      allPairs.push({
        columns: [
          {
            width: "100%",
            table: {
              widths: ["25%", "50%", "25%"],
              body: [
                [
                  "",
                  {
                    table: {
                      widths: ["auto"],
                      alignment: "center",
                      body: renderPhotoAndCaption(
                        photos[i].src,
                        photos[i].caption,
                      ),
                    },
                    layout: photoCaptionLayout,
                  },
                  "",
                ],
              ],
            },
            layout: "noBorders",
            alignment: "center",
          },
        ],
        columnGap: 15,
        margin: 10,
      })
    } else {
      allPairs.push({
        columns: [
          {
            stack: [
              {
                table: {
                  widths: ["auto"],
                  body: renderPhotoAndCaption(photos[i].src, photos[i].caption),
                },
                layout: photoCaptionLayout,
              },
            ],
          },
          {
            stack: [
              {
                table: {
                  widths: ["auto"],
                  body: renderPhotoAndCaption(
                    photos[i + 1].src,
                    photos[i + 1].caption,
                  ),
                },
                layout: photoCaptionLayout,
              },
            ],
          },
        ],
        columnGap: 15,
        margin: 10,
      })
    }
  }

  return allPairs
}
// const photoCaptionLayout = {
//   paddingTop: () => 0,
//   paddingBottom: () => 0,
//   paddingRight: () => 0,
//   paddingLeft: () => 0,
//   hLineWidth: () => 0.5,
//   vLineWidth: () => 0.5,
// }

// const renderCaption = (caption) => [
//   {
//     text: caption,
//     width: 250,
//     alignment: "center",
//     style: "summaryPhotoCaption",
//   },
// ]
// const renderPhoto = (src) => [
//   {
//     image: src,
//     width: 250,
//     alignment: "center",
//   },
// ]

// const renderPhotoAndCaption = (src, caption) => {
//   if (caption) {
//     return [renderPhoto(src), renderCaption(caption)]
//   } else {
//     return [renderPhoto(src)]
//   }
// }

// module.exports = (photos) => {
//   let allPairs = []

//   for (let i = 0; i < photos.length; i += 2) {
//     //if second last element
//     if (i === photos.length - 1) {
//       allPairs.push([
//         {
//           table: {
//             widths: ["25%", "50%", "25%"],
//             body: [
//               [
//                 "",
//                 {
//                   table: {
//                     widths: ["auto"],
//                     alignment: "center",
//                     body: renderPhotoAndCaption(
//                       photos[i].src,
//                       photos[i].caption,
//                     ),
//                   },
//                   layout: photoCaptionLayout,
//                 },
//                 "",
//               ],
//             ],
//           },
//           layout: "noBorders",
//           alignment: "center",
//           colSpan: 2,
//         },
//       ])
//     } else {
//       allPairs.push([
//         {
//           table: {
//             widths: ["auto"],
//             body: renderPhotoAndCaption(photos[i].src, photos[i].caption),
//           },
//           layout: photoCaptionLayout,
//           alignment: "center",
//           colSpan: 1,
//         },
//         {
//           table: {
//             widths: ["auto"],
//             body: renderPhotoAndCaption(
//               photos[i + 1].src,
//               photos[i + 1].caption,
//             ),
//           },
//           layout: photoCaptionLayout,
//           alignment: "center",
//           colSpan: 1,
//         },
//       ])
//     }
//   }

//   return allPairs
// }
