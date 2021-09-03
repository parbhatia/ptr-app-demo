const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:mastercheckbox")
const {
  master_checkbox: {
    select,
    insert_item,
    delete_item,
    update_item,
    update_bool,
  },
  abstract_draggable_item: {
    add_order,
    select_order,
    delete_order,
    update_order,
  },
} = require("../sql")

const parentOrderColumnName = "master_category_id"

router.get("/", async (req, res) => {
  const parentId = req.params.masterCategoryId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.any(select, parentId)
      orderInfo = await t.one(select_order, [parentOrderColumnName, parentId])
    })
    res.send({
      items,
      parent: {
        order_info: orderInfo,
      },
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.post("/", async (req, res) => {
  const parentId = req.params.masterCategoryId
  const { text, parent } = req.body
  let item
  try {
    await db.tx(async (t) => {
      item = await t.one(insert_item, [text, parentId])
      //update parent order
      await t.one(add_order, [parentOrderColumnName, parentId, item.id])
    })
    res.send({
      id: item.id,
      text: item.text,
      used: item.used,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.delete("/", async (req, res) => {
  const parentId = req.params.masterCategoryId
  const { id } = req.body
  let item, orderInfo
  try {
    await db.tx(async (t) => {
      item = await t.one(delete_item, id)
      //update parent order
      orderInfo = await t.one(delete_order, [
        parentOrderColumnName,
        parentId,
        item.id,
      ])
    })
    res.send({
      id: item.id,
      parent: {
        order_info: orderInfo,
      },
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//update parent order
router.patch("/", async (req, res) => {
  const parentId = req.params.masterCategoryId
  const { parent } = req.body
  try {
    const orderInfo = await db.one(update_order, [
      parentOrderColumnName,
      parentId,
      parent.order_info.info,
    ])
    res.send({
      parent: {
        order_info: orderInfo,
      },
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//update used value
router.patch("/updatebool", async (req, res) => {
  debug("hit bool update!")
  const { id, boolVal } = req.body
  try {
    const item = await db.one(update_bool, [boolVal, id])
    res.send({
      id: item.id,
      boolVal: item.used,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//update text value
router.patch("/updatetext", async (req, res) => {
  const { id, text } = req.body
  try {
    const item = await db.one(update_item, [text, id])
    res.send({
      id: item.id,
      text: item.text,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
