const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:inspectioneople")
const {
  inspection_persons: {
    select,
    select_persons_and_emails,
    insert_person,
    remove_person,
  },
} = require("../sql")

// select persons of inspection
router.get("/", async (req, res) => {
  const { inspectionId } = req.params
  const userId = req.headers.user_id
  try {
    const persons = await db.any(select, [inspectionId, userId])
    res.send({
      persons,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//get all persons and their emails for an inspection
router.get("/getPersonsAndEmails", async (req, res) => {
  const userId = req.headers.user_id
  const inspectionId = req.params.inspectionId
  try {
    const personsAndEmails = await db.any(select_persons_and_emails, [
      inspectionId,
      userId,
    ])
    res.send({
      personsAndEmails,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//add person to inspection
router.post("/:personId", async (req, res) => {
  const inspectionId = req.params.inspectionId
  const personId = req.params.personId
  try {
    const person = await db.one(insert_person, [inspectionId, personId])
    res.send({
      person,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//remove person from inspection, we never delete a person row from database
router.delete("/:personId", async (req, res) => {
  const inspectionId = req.params.inspectionId
  const personId = req.params.personId
  try {
    const person = await db.one(remove_person, [inspectionId, personId])
    res.send({
      person,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
