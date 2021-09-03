const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:draggablecategory")
const {
  draggable_category: {
    select,
    select_more,
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

const parentOrderColumnName = "master_store_id"

router.get("/", async (req, res) => {
  const pageId = req.params.pageId
  try {
    const draggableCategories = await db.manyOrNone(select, pageId)
    res.send({
      draggableCategories,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use(
  "/:draggableCategoryId/draggablecheckbox",
  require("./draggablecheckbox").router,
)

//the following routes are only used by master item store
//-------------------------------------------------

router.get("/ofmasterstore", async (req, res) => {
  const parentId = req.params.masterStoreId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.any(select_more, parentId)
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

router.use(
  "/ofmasterstore/:draggableCategoryId/draggablecheckbox",
  require("./draggablecheckbox").router,
)

router.post("/ofmasterstore", async (req, res) => {
  const { text } = req.body
  const parentId = req.params.masterStoreId
  let item, order
  try {
    await db.tx(async (t) => {
      item = await t.one(insert_item, [text, parentId])
      //create order info
      order = await t.one(insert_order, ["draggable_category_id", item.id])
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
    debug(e)
    res.sendStatus(400)
  }
})

router.delete("/ofmasterstore", async (req, res) => {
  const parentId = req.params.masterStoreId
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
    debug(e)
    res.sendStatus(400)
  }
})

router.patch("/ofmasterstore", async (req, res) => {
  const parentId = req.params.masterStoreId
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

//update text value
router.patch("/ofmasterstore/updatetext", async (req, res) => {
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
