const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:category")
const {
  category: { select },
} = require("../sql")

router.get("/", async (req, res) => {
  const subsectionId = req.params.subsectionId
  try {
    const categories = await db.any(select, subsectionId)
    res.send({
      categories,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.use("/:categoryId/checkbox", require("./checkbox").router)

//Export Router
module.exports.router = router
