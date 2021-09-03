const express = require("express")
const router = express.Router({ mergeParams: true })
const validateRole = require("../middleware/validateRole")

router.use("/:masterStoreId", validateRole("master_store", "masterStoreId"))

router.use(
  "/:masterStoreId/draggablecategory",
  require("./draggablecategory").router,
)

//Export Router
module.exports.router = router
