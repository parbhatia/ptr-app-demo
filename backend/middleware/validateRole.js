const db = require("../config/db")
const {
  auth: { validate_role },
} = require("../sql")
const debug = require("debug")("backend:validateRole")

//validates role based on underlying table's user_id foreign key
const validateRole = (table, paramName) => {
  return async function (req, res, next) {
    try {
      const userId = parseInt(req.headers.user_id)
      const tableId = req.params[paramName]
      const row = await db.one(validate_role, [table, tableId])
      if (row.user_id !== userId) {
        throw new Error("Unauthorized User")
      } else {
        return next()
      }
    } catch (e) {
      debug(e)
      res.redirect("/api/forbidden")
    }
  }
}

module.exports = validateRole
