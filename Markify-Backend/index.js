require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoutes = require('./src/routes/user.routes');
const bookmarkRoutes = require('./src/routes/bookmark.routes');
const previewRoutes = require('./src/routes/preview.routes');
const collectionRoutes = require('./src/routes/collection.routes');
const errorHandler = require("./src/middleware/error.middleware");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

// --- THIS IS THE FIX ---
// Add a route to handle requests to the base URL
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

// This line is for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`)
  })
}

// Export the app for Vercel
module.exports = app;