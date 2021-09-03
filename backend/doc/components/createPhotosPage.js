const createSummaryPhotosPairs = require("./createSummaryPhotosPairs")
const createPage = require("./createPage")

module.exports = (data) =>
  createPage({
    pageHeaderInfo: {
      pageName: "Photos",
      info: data.info,
      uniqueId: data.unique_id,
    },
    content: {
      stack: [createSummaryPhotosPairs(data.summary.photos)],
    },
  })
// const createSummaryPhotosPairs = require("./createSummaryPhotosPairs")
// const createPage = require("./createPage")

// module.exports = (data) =>
//   createPage({
//     pageHeaderInfo: {
//       pageName: "Photos",
//       info: data.info,
//       uniqueId: data.unique_id,
//     },
//     content: {
//       table: {
//         widths: ["50%", "50%"],
//         headerRows: 0,
//         body: createSummaryPhotosPairs(data.summary.photos),
//       },
//       layout: "noBorders",
//     },
//   })
