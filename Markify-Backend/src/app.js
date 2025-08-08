require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/user.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const previewRoutes = require('./routes/preview.routes');
const collectionRoutes = require('./routes/collection.routes');
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

// --- ADD THIS ROOT ROUTE ---
// This handles requests to the base URL (e.g., https://markify-api.vercel.app/)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Markify API is running successfully.' });
});
// ----------------------------

// --- API Routes ---
app.use('/api/preview', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);

app.use(errorHandler);

module.exports = app;