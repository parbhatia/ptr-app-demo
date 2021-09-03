const debug = require("debug")("backend:/subject")
const express = require("express")

const router = express.Router()
const {
  generateSubject,
  generateMessage,
} = require("../helpers/generateEmailFields")

router.post("/", async (req, res) => {
  const { address } = req.body
  try {
    const subject = generateSubject(address)
    const message = generateMessage()
    res.send({
      subject,
      message,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

module.exports.router = router
