const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:draggablesubcheckbox")
const {
  draggable_subcheckbox: { insert_item, delete_item, update_item },
  abstract_draggable_item: { add_order, delete_order, update_order },
} = require("../sql")

const parentOrderColumnName = "draggable_checkbox_id"

router.post("/", async (req, res) => {
  const { text } = req.body
  const parentId = req.params.draggableCheckboxId
  let item, order
  try {
    await db.tx(async (t) => {
      item = await t.one(insert_item, [text, parentId])
      //update parent order
      await t.one(add_order, [parentOrderColumnName, parentId, item.id])
    })
    res.send({
      id: item.id,
      text: item.text,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.delete("/", async (req, res) => {
  const { id } = req.body
  const parentId = req.params.draggableCheckboxId
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
    debug(e)
    res.sendStatus(400)
  }
})

router.patch("/", async (req, res) => {
  const { parent } = req.body
  const parentId = req.params.draggableCheckboxId
  try {
    //update parent order
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
    debug(e)
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
