const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:overview")
const {
  overview: { stats },
} = require("../sql")

router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  try {
    const rows = await db.oneOrNone(stats, [userId])
    res.send(rows)
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
