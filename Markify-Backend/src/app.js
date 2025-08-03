// src/app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/user.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const previewRoutes = require('./routes/preview.routes');
const errorHandler = require("./middleware/error.middleware");

// Create the app instance
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Apply routes
app.use('/api', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Apply error handler
app.use(errorHandler);

// Export the configured app
module.exports = app;