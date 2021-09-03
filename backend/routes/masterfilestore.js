const express = require("express")
const router = express.Router({ mergeParams: true })
const debug = require("debug")("backend:masterfilestore")
const db = require("../config/db")
const {
  master_file_store: { select },
} = require("../sql")
const validateRole = require("../middleware/validateRole")

router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  try {
    const store = await db.one(select, userId)
    res.send({
      store,
    })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use(
  "/:masterFileStoreId",
  validateRole("master_file_store", "masterFileStoreId"),
)

router.use("/:masterFileStoreId/masterfile", require("./masterfile").router)

module.exports.router = router
