const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:storecategory")
const {
  store_category: { select },
} = require("../sql")

router.get("/", async (req, res) => {
  const parentId = req.params.storeId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.any(select, parentId)
    })
    res.send({
      items,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use("/:storeCategoryId/storecheckbox", require("./storecheckbox").router)

//Export Router
module.exports.router = router
