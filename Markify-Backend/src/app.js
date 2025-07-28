const express = require("express")
const app = express()
const bookmarkRoutes = require("./routes/bookmark.routes")
const errorHandler = require("./middlewares/error.middleware")

app.use(express.json())

// Routes
app.use("/api/bookmarks", bookmarkRoutes)

// Error Handler
app.use(errorHandler)

module.exports = app
