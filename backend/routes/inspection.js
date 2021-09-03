const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:inspection")
const validateRole = require("../middleware/validateRole")
const {
  search,
  inspection: {
    insert_item,
    select_item,
    select_inspection_status,
    toggle_inspection_status,
    initiate_inspection,
    update_item,
    select_inspection_store,
  },
  shareable_link: {
    insert_item: insert_shareable_link,
    select_shareable_links_minimal,
  },
} = require("../sql")
const inspectionLastModified = require("../middleware/inspectionLastModified")
const {
  generateUniqueId,
  generateInspectionId,
} = require("../helpers/generateUniqueId")

const inspectionStatusTypeArray = ["in_progress", "completed"]

router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  const query = req.query.search
  const limit = req.query.limit
  const pageStartIndex = (req.query.page - 1) * limit
  let inspectionStatusTypeFilter = req.query.filter
  if (inspectionStatusTypeFilter === "all") {
    inspectionStatusTypeFilter = inspectionStatusTypeArray
  } else {
    inspectionStatusTypeFilter = [inspectionStatusTypeFilter]
  }
  // debug({
  //   limit: 10,
  //   pageStartIndex: pageStartIndex,
  // })
  const lazyQuery = "%" + query + "%"
  try {
    const rows = await db.any(search.inspection, [
      lazyQuery,
      userId,
      pageStartIndex,
      limit,
      inspectionStatusTypeFilter,
    ])
    res.send(rows)
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.post("/", async (req, res) => {
  const userId = req.headers.user_id
  //generate unique_id for inspection
  const newUniqueId = generateInspectionId()

  //generate unique_ids (urls) for sharable links, one for summary, one for full
  const summaryShareableLinkUniqueId = generateUniqueId()
  const fullShareableLinkUniqueId = generateUniqueId()

  //extract master page store id from ob, use it to initiate inspection
  const pageStoreId = req.body.pageStoreId
  const inspectionInfo = req.body
  delete req.body["pageStoreId"]
  const parsedInspectioninfo = inspectionInfo
  const ob = JSON.stringify(parsedInspectioninfo)
  let item
  db.tx(async (t) => {
    item = await t.one(insert_item, [ob, userId, newUniqueId])

    //create shareable links
    await t.one(insert_shareable_link, [
      summaryShareableLinkUniqueId,
      item.id,
      "summary",
    ])
    await t.one(insert_shareable_link, [
      fullShareableLinkUniqueId,
      item.id,
      "full",
    ])

    //populate inspection from selected template (page store)
    const success = await t.one(initiate_inspection, [item.id, pageStoreId])

    if (!success.initiate_inspection) {
      throw new Error("Unable to create inspection")
    }
  })
    .then(() => {
      res.send(item)
    })
    .catch((e) => {
      debug(e)
      res.sendStatus(400)
    })
})

router.use("/:inspectionId", validateRole("inspection", "inspectionId"))

//update existing inspection
router.patch("/:inspectionId", inspectionLastModified, async (req, res) => {
  const userId = req.headers.user_id
  const { info, inspectionId } = req.body
  try {
    const existingInspection = await db.one(update_item, [
      info,
      inspectionId,
      userId,
    ])
    res.send(existingInspection)
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.get("/:inspectionId", async (req, res) => {
  const userId = req.headers.user_id
  const id = req.params.inspectionId
  let store, inspection, shareableLinks
  db.tx(async (t) => {
    inspection = await t.one(select_item, [id, userId])
    store = await t.one(select_inspection_store, id)
    shareableLinks = await t.many(select_shareable_links_minimal, id)
    shareableLinks = await t.any(select_shareable_links_minimal, id)
  })
    .then((data) => {
      res.send({
        inspection,
        store,
        shareableLinks,
      })
    })
    .catch((e) => {
      debug(e)
      res.sendStatus(400)
    })
})

router.get("/:inspectionId/inspectionStatus", async (req, res) => {
  const id = req.params.inspectionId
  try {
    const status = await db.one(select_inspection_status, id)
    res.send({ status })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})
router.patch("/:inspectionId/inspectionStatus", async (req, res) => {
  const id = req.params.inspectionId
  try {
    const status = await db.one(toggle_inspection_status, id)
    res.send({ status })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

router.use("/:inspectionId/createpdf", require("./createpdf").router)
router.use(
  "/:inspectionId/page",
  inspectionLastModified,
  require("./page").router,
)
router.use("/:inspectionId/shareablelink", require("./shareablelink").router)

router.use("/:inspectionId/emailrecords", require("./emailrecords").router)

router.use(
  "/:inspectionId/store/:storeId/storecategory",
  inspectionLastModified,
  require("./storecategory").router,
)
router.use("/:inspectionId/people", require("./inspectionpeople").router)
// router.use("/:inspectionId/people", require("./person").router)
router.use(
  "/:inspectionId/photocategory",
  inspectionLastModified,
  require("./photocategory").router,
)

//Export Router
module.exports.router = router
