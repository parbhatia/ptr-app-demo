const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:page")
const {
  page: { select },
} = require("../sql")

router.get("/", async (req, res) => {
  const inspectionId = req.params.inspectionId
  try {
    const pages = await db.any(select, inspectionId)
    // debug(rows)
    res.send({ pages })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use("/:pageId/subsection", require("./subsection").router)

router.use("/:pageId/draggablecategory", require("./draggablecategory").router)
router.use("/:pageId/photocategory", require("./photocategory").router)

//Export Router
module.exports.router = router
