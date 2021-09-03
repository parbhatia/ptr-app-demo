const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:checkbox")
const {
  checkbox: { select, update_checkbox_boolean, insert_item },
} = require("../sql")

router.get("/", async (req, res) => {
  const categoryId = req.params.categoryId
  try {
    const checkboxes = await db.any(select, categoryId)
    res.send({
      checkboxes,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//update checkbox boolean
router.patch("/:id/:boolVal", async (req, res) => {
  const { id, boolVal } = req.params
  try {
    const checkbox = await db.one(update_checkbox_boolean, [id, boolVal])
    res.send({ ...checkbox })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//add new checkbox
router.post("/", async (req, res) => {
  const { categoryId, text } = req.body
  let checkbox, order_info
  db.tx(async (t) => {
    checkbox = await t.one(insert_item, [text, categoryId])
  })
    .then((data) => {
      res.send({ ...checkbox })
    })
    .catch((e) => {
      debug(e)
      res.sendStatus(400)
    })
})

//Export Router
module.exports.router = router
