const nanoid = require("nanoid")
const session = require("express-session")

const uniqueIdGenerator = nanoid.customAlphabet(
  "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
  4,
)
const customSessionId = uniqueIdGenerator()

// create unique session, needs no security as it's not authenticating anything
module.exports = session({
  genid(req) {
    return customSessionId
  },
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
})
