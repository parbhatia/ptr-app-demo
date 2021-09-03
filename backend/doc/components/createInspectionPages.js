const createPage = require("./createPage")
const createSubsections = require("./createSubsections")

module.exports = (data) =>
  data.pages.map((page) => {
    return createPage({
      pageHeaderInfo: {
        pageName: page.name,
        info: data.info,
        uniqueId: data.unique_id,
      },

      //render subsections
      content: createSubsections(page),
    })
  })
