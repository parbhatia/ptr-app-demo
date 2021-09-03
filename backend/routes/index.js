const express = require("express")
const router = express.Router()
const debug = require("debug")("backend:routes")

try {
  router.use("/emailwebhook", require("./emailwebhook").router)

  router.use("/inspection", require("./inspection").router)
  router.use("/overview", require("./overview").router)
  router.use("/emailrecords", require("./emailrecords").router)

  router.use("/masterstore", require("./masterstore").router)
  router.use("/masterpagestore", require("./masterpagestore").router)
  router.use("/masterfilestore", require("./masterfilestore").router)
  router.use(
    "/masterphotocaptionstore",
    require("./masterphotocaptionstore").router,
  )
  router.use("/person", require("./person").router)
  router.use("/photocategory", require("./photocategory").router)

  router.use("/shared", require("./shareablelink").router)

  router.use("/sendemail", require("./sendemail").router)

  router.use("/imageprocess", require("./imageprocess").router)
  router.use("/subject", require("./subject").router)
  router.use("/requests3resource", require("./requests3resource").router)

  router.get("/forbidden", (req, res) => {
    res.sendStatus(403)
  })
  router.get("*", (req, res) => {
    res.sendStatus(403)
  })
} catch (e) {
  debug(e)
}

module.exports = router
