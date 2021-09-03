const express = require("express")
const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:mastersubsection")
const db = require("../config/db")
const {
  master_subsection: {
    select,
    select_draggable_categories,
    insert_item,
    delete_item,
    update_item,
  },
  abstract_draggable_item: {
    add_order,
    select_order,
    insert_order,
    delete_order,
    update_order,
  },
} = require("../sql")

const parentOrderColumnName = "master_page_id"

//get subsections and also draggable_categories of page
router.get("/", async (req, res) => {
  const parentId = req.params.masterPageId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.any(select, parentId)
      draggable_categories = await t.manyOrNone(
        select_draggable_categories,
        parentId,
      )
      orderInfo = await t.one(select_order, [parentOrderColumnName, parentId])
    })
    res.send({
      items,
      draggable_categories,
      parent: {
        order_info: orderInfo,
      },
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.use(
  "/:masterSubsectionId/mastercategory",
  require("./mastercategory").router,
)

router.post("/", async (req, res) => {
  const parentId = req.params.masterPageId
  const { text } = req.body
  let item, order
  debug({ parentId, text })
  try {
    await db.tx(async (t) => {
      item = await t.one(insert_item, [text, parentId])
      //create empty order for children
      order = await t.one(insert_order, ["master_subsection_id", item.id])
      //update parent order
      await t.one(add_order, [parentOrderColumnName, parentId, item.id])
    })
    res.send({
      id: item.id,
      name: item.name,
      info: order.info,
      order_id: order.id,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.delete("/", async (req, res) => {
  const parentId = req.params.masterPageId
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

router.patch("/", async (req, res) => {
  const parentId = req.params.masterPageId
  const { parent } = req.body
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

router.patch("/updatetext", async (req, res) => {
  const { id, name } = req.body
  try {
    const item = await db.one(update_item, [name, id])
    res.send({
      id: item.id,
      name: item.name,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
