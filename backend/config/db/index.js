const pgp = require("pg-promise")()

const cn = {
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  max: 30, // use up to 30 connections
}
const db = pgp(cn)

module.exports = db
