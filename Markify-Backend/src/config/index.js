require("dotenv").config()

module.exports = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DATABASE_URL,
}
