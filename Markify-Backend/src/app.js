require('dotenv').config(); // Ensure this is at the top of your server.js, not here
const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/user.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const previewRoutes = require('./routes/preview.routes');
const collectionRoutes = require('./routes/collection.routes');
const errorHandler = require("./middleware/error.middleware");

const app = express();

// --- Middleware Setup ---
// 1. Configure CORS once with the correct origin
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173" // Default for Vite React apps
}));

// 2. Body parser
app.use(express.json());

// --- Routes ---
app.use('/api/preview', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);

// --- Error Handler ---
// This should typically be the last middleware
app.use(errorHandler);

module.exports = app;