const express = require("express")
const router = express.Router({ mergeParams: true })
const db = require("../config/db")
const debug = require("debug")("backend:person")
const {
  person: { insert_person, update_person },
  search: { person: person_search },
} = require("../sql")
const validateRole = require("../middleware/validateRole")

const personTypeArray = ["client", "realtor"]

//paginated search
router.get("/", async (req, res) => {
  const userId = req.headers.user_id
  const query = req.query.search
  const limit = req.query.limit
  const order = req.query.order
  const inspectionId = req.query.inspectionId
  let personTypeFilter = req.query.personTypeFilter
  if (personTypeFilter === "all") {
    personTypeFilter = personTypeArray
  } else {
    personTypeFilter = [personTypeFilter]
  }
  const pageStartIndex = (req.query.page - 1) * limit
  const lazyQuery = "%" + query + "%"
  try {
    const persons = await db.any(person_search, [
      lazyQuery,
      userId,
      personTypeFilter,
      pageStartIndex,
      limit,
      inspectionId,
      order,
    ])

    res.send({
      persons,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})
router.use(
  "/:personId/:contactAttribute",
  validateRole("person", "personId"),
  require("./contactattribute").router,
)

//add global person
router.post("/", async (req, res) => {
  const userId = req.headers.user_id
  const { personName, personType } = req.body
  try {
    const person = await db.one(insert_person, [personName, personType, userId])
    res.send({
      person,
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.patch("/:personId", async (req, res) => {
  debug("hit patch")
  const userId = req.headers.user_id
  const personId = req.params.personId
  const { personName } = req.body
  try {
    const person = await db.one(update_person, [personId, personName, userId])
    res.send({ person })
  } catch (e) {
    debug(e)
    res.sendStatus(400)
  }
})

//Export Router
module.exports.router = router
