const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const pgp = require("pg-promise")()
const debug = require("debug")("backend:storecheckbox")
const {
  store_checkbox: { select },
} = require("../sql")

router.get("/", async (req, res) => {
  const parentId = req.params.storeCategoryId
  let items, orderInfo
  try {
    await db.tx(async (t) => {
      items = await t.manyOrNone(select, parentId)
    })

    res.send({
      items: items,
    })
  } catch (e) {
    res.sendStatus(400).send(e)
  }
})

router.patch("/bulkupdate", async (req, res) => {
  const { bulkData } = req.body
  //defining templates for queries

  const updateItems = new pgp.helpers.ColumnSet(["?id", "used"], {
    table: "store_checkbox",
  })
  const updateSubitems = new pgp.helpers.ColumnSet(["?id", "used"], {
    table: "store_subcheckbox",
  })

  //flatten bulk data items
  const flattenedItems = bulkData.map((item) => ({
    id: item.id,
    used: !item.used,
  }))
  // debug("flattenedItems", flattenedItems)
  try {
    await db.tx(async (t) => {
      const query1 =
        pgp.helpers.update(flattenedItems, updateItems) +
        " WHERE v.id = t.id RETURNING t.id;"

      const newItems = await t.map(query1, [], (a) => a.id)

      const subItemLengths = bulkData.map((item) => item.items.length)
      const subItemArrays = bulkData.map((item, idx) =>
        item.items.map((sub) => ({
          id: sub.id,
          used: !sub.used,
        })),
      )
      //flatten subitem arrays
      const flattenedSubitems = [].concat(...subItemArrays)
      // debug("flatteenedSubItems", flattenedSubitems)
      let newSubitems
      if (flattenedSubitems.length !== 0) {
        const query2 =
          pgp.helpers.update(flattenedSubitems, updateSubitems) +
          " WHERE v.id = t.id RETURNING t.id;"
        newSubitems = await t.map(query2, [], (a) => a.id)
      }

      //place back returned item ids
      const items = bulkData.map((item, idx) => ({
        id: newItems[idx],
        checkedSubitems: [],
      }))
      if (flattenedSubitems.length !== 0) {
        //place new subItem info
        let doneIdx = 0
        items.forEach((item, idx) => {
          const subIds = newSubitems.slice(doneIdx, subItemLengths[idx])
          items[idx] = {
            ...item,
            checkedSubitems: subIds,
          }
          doneIdx = doneIdx + subItemLengths[idx]
        })
      }

      // debug("final items", items)
      res.send({
        items,
      })
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400).send(e)
  }
})

//Export Router
module.exports.router = router
