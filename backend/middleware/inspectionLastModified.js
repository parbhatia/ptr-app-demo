const db = require("../config/db")
const debug = require("debug")("backend:inspectionLastModified")

// Middleware that "taints" an inspection
// This allows us to update whether an inspection
// needs it's pdf to be recreated or not
// req can receive an optional taintPdf parameter as a root field, which can be a boolean
// this allows us to conditionally taint/untaint pdf from client side
const inspectionLastModified = async (req, res, next) => {
  try {
    const { inspectionId } = req.params
    if (inspectionId === undefined || inspectionId === null) {
      throw new Error(
        "Inspection id NULL. Unable to update inspection last_modified field.",
      )
    }
    if (req.method === "GET") {
      return next()
    } else {
      //update last_modified
      const date = await db.one(
        "update inspection set last_modified=now() where id=$1 returning last_modified;",
        inspectionId,
      )
      debug(`Inspection id ${inspectionId}: Inspection tainted.`)
      return next()
    }
  } catch (e) {
    debug(e)
    return next(e)
  }
}
module.exports = inspectionLastModified
