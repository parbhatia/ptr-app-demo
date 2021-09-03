const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:photocategory")
const {
  photo_category: { select_of_inspection, select_of_master, select_of_page },
} = require("../sql")

//each route sends photo category id of parentId, which could be a page, inspection or a master_photo_reference category with no page or inspection id

router.get("/:photoCategoryTypeLabel", async (req, res) => {
  const photoCategoryTypeLabel = req.params.photoCategoryTypeLabel
  try {
    if (photoCategoryTypeLabel === "ofPage") {
      const pageId = req.params.pageId
      const photoCategory = await db.one(select_of_page, pageId)
      res.send({
        id: photoCategory.id,
      })
    } else if (photoCategoryTypeLabel === "ofInspection") {
      const inspectionId = req.params.inspectionId
      const photoCategory = await db.one(select_of_inspection, inspectionId)
      res.send({
        id: photoCategory.id,
      })
    } else if (photoCategoryTypeLabel === "ofMaster") {
      const userId = req.headers.user_id
      const photoCategory = await db.one(select_of_master, userId)
      res.send({
        id: photoCategory.id,
      })
    }
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use(
  "/:photoCategoryTypeLabel/:photoCategoryId/photo",
  require("./photo").router,
)

//Export Router
module.exports.router = router
