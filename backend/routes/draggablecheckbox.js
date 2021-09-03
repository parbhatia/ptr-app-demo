const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const pgp = require("pg-promise")()
const debug = require("debug")("backend:draggablecheckbox")
const {
  draggable_checkbox: { select, insert_item, delete_item, update_item },
  abstract_draggable_item: {
    add_order,
    select_order,
    insert_order,
    add_order_bulk,
    delete_order,
    update_order,
  },
  search,
} = require("../sql")

const parentOrderColumnName = "draggable_category_id"

router.get("/", async (req, res) => {
  const parentId = req.params.draggableCategoryId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.manyOrNone(select, parentId)
      orderInfo = await t.one(select_order, [parentOrderColumnName, parentId])
    })
    res.send({
      items: items,
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
  "/:draggableCheckboxId/draggablesubcheckbox",
  require("./draggablesubcheckbox").router,
)

router.get("/search", async (req, res) => {
  const query = req.query.search
  try {
    const checkboxes = await db.any(search.draggable_checkbox, query)
    res.send({
      checkboxes,
    })
  } catch (e) {
    debug("error", e)
    res.sendStatus(400)
  }
})

router.post("/bulkinsert", async (req, res) => {
  const parentId = req.params.draggableCategoryId
  const { bulkData, parent } = req.body
  //defining templates for queries
  const addItems = new pgp.helpers.ColumnSet(["text", parentOrderColumnName], {
    table: "draggable_checkbox",
  })
  const addSubitems = new pgp.helpers.ColumnSet(
    ["text", "draggable_checkbox_id"],
    {
      table: "draggable_subcheckbox",
    },
  )
  const insertOrderInfo = new pgp.helpers.ColumnSet(
    ["info", "draggable_checkbox_id"],
    {
      table: "order_info",
    },
  )

  //flatten bulk data items
  const flattenedItems = bulkData.map((item) => ({
    text: item.text,
    draggable_category_id: parent.id,
  }))

  try {
    await db.tx(async (t) => {
      const query1 =
        pgp.helpers.insert(flattenedItems, addItems) + "RETURNING id, text"
      const newItems = await t.map(query1, [], (a) => ({
        id: a.id,
        text: a.text,
      }))

      //flatten subitems
      const subItemLengths = bulkData.map((item) => item.items.length)
      const subItemArrays = bulkData.map((item, idx) =>
        item.items.map((sub) => ({
          ...sub,
          draggable_checkbox_id: newItems[idx].id,
        })),
      )
      //flatten subitem arrays
      const flattenedSubitems = [].concat(...subItemArrays)
      let newSubitems = []

      //only proceed with bulk inserts if we have a non-empty array
      if (flattenedSubitems.length !== 0) {
        const query2 =
          pgp.helpers.insert(flattenedSubitems, addSubitems) +
          "RETURNING id, text"
        newSubitems = await t.map(query2, [], (a) => ({
          id: a.id,
          text: a.text,
        }))
      }

      //place back returned item ids
      const items = bulkData.map((item, idx) => ({
        id: newItems[idx].id,
        text: newItems[idx].text,
      }))
      //place new subItem info
      let doneIdx = 0
      items.forEach((item, idx) => {
        const subIds = newSubitems.slice(doneIdx, subItemLengths[idx])
        items[idx] = {
          ...item,
          items: subIds,
        }
        doneIdx = doneIdx + subItemLengths[idx]
      })

      // empty order infos are NOT created by trigger. create them using new itemIds
      const flattenedOrders = items.map((item, idx) => ({
        info: item.items.map((sub) => sub.id),
        draggable_checkbox_id: item.id,
      }))

      const query3 =
        pgp.helpers.insert(flattenedOrders, insertOrderInfo) +
        "RETURNING id, info"
      const order = await t.map(query3, [], (a) => ({
        id: a.id,
        info: a.info,
      }))
      // place order array values into items
      items.forEach((item, idx) => {
        items[idx] = {
          ...item,
          info: order[idx].info,
          order_id: order[idx].id,
        }
      })

      //update parent order
      await t.one(add_order_bulk, [
        parentOrderColumnName,
        parentId,
        items.map((item) => item.id),
      ])
      res.send({
        items,
      })
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.post("/", async (req, res) => {
  const { text } = req.body
  const parentId = req.params.draggableCategoryId
  let item, order
  try {
    await db.tx(async (t) => {
      item = await t.one(insert_item, [text, parentId])
      //create empty order info
      order = await t.one(insert_order, ["draggable_checkbox_id", item.id])
      //update parent order
      await t.one(add_order, [parentOrderColumnName, parentId, item.id])
    })
    res.send({
      id: item.id,
      text: item.text,
      info: order.info,
      items: [],
      order_id: order.id,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.delete("/", async (req, res) => {
  const { id } = req.body
  const parentId = req.params.draggableCategoryId
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
  const parentId = req.params.draggableCategoryId
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
