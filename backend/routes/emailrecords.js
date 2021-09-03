const debug = require("debug")("backend:/emailrecords")
const express = require("express")
const db = require("../config/db")
const {
  email_record: {
    select_of_user,
    select_of_shareable_link,
    select_of_inspection,
  },
} = require("../sql")

const router = express.Router({ mergeParams: true })

router.get("/ofShareableLink", async (req, res) => {
  const { shareableLinkId } = req.params
  const limit = req.query.limit
  try {
    const emailRecords = await db.any(select_of_shareable_link, [
      shareableLinkId,
      limit,
    ])
    res.send({
      emailRecords,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.get("/ofUser", async (req, res) => {
  const userId = req.headers.user_id
  const limit = req.query.limit
  try {
    const emailRecords = await db.any(select_of_user, [userId, limit])
    res.send({
      emailRecords,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.get("/ofInspection", async (req, res) => {
  const userId = req.headers.user_id
  const limit = req.query.limit
  const { inspectionId } = req.params
  try {
    const emailRecords = await db.any(select_of_inspection, [
      userId,
      inspectionId,
      limit,
    ])
    res.send({
      emailRecords,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

module.exports.router = router
