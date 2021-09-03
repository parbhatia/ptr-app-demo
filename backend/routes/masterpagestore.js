const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:masterpagestore")
const validateRole = require("../middleware/validateRole")
const {
  master_page_store: {
    select,
    insert_item,
    delete_item,
    update_item,
    duplicate_item,
  },
} = require("../sql")

router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  try {
    const templates = await db.many(select, userId)
    res.send({
      templates,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use(
  "/:masterPageStoreId",
  validateRole("master_page_store", "masterPageStoreId"),
)

router.use("/:masterPageStoreId/masterpage", require("./masterpage").router)

router.post("/", async (req, res) => {
  const userId = req.headers.user_id
  const { name } = req.body
  try {
    const item = await db.one(insert_item, [name, userId])
    res.send({
      id: item.id,
      name: item.name,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})
router.post("/:masterPageStoreId/duplicate", async (req, res) => {
  const userId = req.headers.user_id
  const { id, name } = req.body
  try {
    const item = await db.one(insert_item, [name, userId])
    const success = await db.one(duplicate_item, [id, item.id])
    debug({ success })
    if (success.copy_master_page_store) {
      res.send({
        id: item.id,
        name: item.name,
        success,
      })
    } else {
      throw new Error("Could not copy master page store")
    }
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.delete("/", async (req, res) => {
  const userId = req.headers.user_id
  const { id } = req.body
  try {
    const item = await db.one(delete_item, [id, userId])
    res.send({
      id: item.id,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//update text value
router.patch("/:masterPageStoreId/updatetext", async (req, res) => {
  const userId = req.headers.user_id
  const { id, name } = req.body
  try {
    const item = await db.one(update_item, [name, id, userId])
    res.send({
      id: item.id,
      name: item.name,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
