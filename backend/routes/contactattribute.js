const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:attribute")
const {
  contact_attribute: { select_items, insert_item, update_item, delete_item },
} = require("../sql")

router.get("/", async (req, res) => {
  const { personId, contactAttribute } = req.params
  try {
    const attributes = await db.any(select_items, [personId, contactAttribute])
    res.send({
      attributes,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//add new attribute
router.post("/", async (req, res) => {
  const { personId, contactAttribute } = req.params
  const { attributeValue } = req.body
  try {
    const attribute = await db.one(insert_item, [
      attributeValue,
      personId,
      contactAttribute,
    ])
    res.send({
      attribute,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.patch("/:attributeId", async (req, res) => {
  const { attributeId, contactAttribute } = req.params
  const { attributeValue } = req.body
  try {
    const attribute = await db.one(update_item, [
      attributeId,
      attributeValue,
      contactAttribute,
    ])
    res.send({ attribute })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//we remove person_id from attribute, we never delete an attribute row from db
router.delete("/:attributeId", async (req, res) => {
  const { attributeId, contactAttribute } = req.params
  try {
    const attribute = await db.one(delete_item, [attributeId, contactAttribute])
    res.send({
      attribute,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
