const express = require("express")
const app = express()
const bookmarkRoutes = require("./routes/bookmark.routes")
const userRoutes = require('./routes/user.routes');
const errorHandler = require("./middlewares/error.middleware")

app.use(express.json())
const cors = require("cors")
app.use(cors())

// Routes
app.use('/api', bookmarkRoutes); // <-- Use '/api' as the base pat
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler)

module.exports = app
