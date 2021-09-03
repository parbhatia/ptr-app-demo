const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:subsection")
const {
  subsection: { select_subsections, select_draggable_categories },
} = require("../sql")

router.get("/", async (req, res) => {
  const pageId = req.params.pageId
  let subsections, page, draggableCategories
  db.tx(async (t) => {
    subsections = await t.any(select_subsections, pageId)
    draggableCategories = await t.manyOrNone(
      select_draggable_categories,
      pageId,
    )
  })
    .then((data) => {
      res.send({
        subsections,
        draggableCategories,
      })
    })
    .catch((e) => {
      debug(e)
      res.sendStatus(400)
    })
})

router.use("/:subsectionId/category", require("./category").router)

//Export Router
module.exports.router = router
