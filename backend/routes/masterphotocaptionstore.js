const express = require("express")
const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:masterphotocaptionstore")
const db = require("../config/db")
const {
  master_photo_caption_store: { select },
  draggable_checkbox: { select: select_draggable_checkbox },
} = require("../sql")
const validateRole = require("../middleware/validateRole")

router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  try {
    //get draggable_category directly, we can use it's master_photo_caption_store_id
    const category = await db.one(select, userId)
    res.send({
      category,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})
router.get("/fetchCaptions", async (req, res) => {
  const userId = req.headers.user_id
  try {
    await db.tx(async (t) => {
      const category = await t.one(select, userId)
      const checkboxes = await t.any(select_draggable_checkbox, category.id)
      res.send({
        checkboxes,
      })
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use(
  "/:masterPhotoCaptionStoreId",
  validateRole("master_photo_caption_store", "masterPhotoCaptionStoreId"),
)

router.use(
  "/:masterPhotoCaptionStoreId/draggablecategory",
  require("./draggablecategory").router,
)

module.exports.router = router
