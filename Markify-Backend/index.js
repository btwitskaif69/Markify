const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const userRoutes = require('./src/routes/user.routes');
const bookmarkRoutes = require('./src/routes/bookmark.routes');
const previewRoutes = require('./src/routes/preview.routes');
const collectionRoutes = require('./src/routes/collection.routes');
const blogRoutes = require('./src/routes/blog.routes');
const geminiRoutes = require('./src/routes/gemini.routes');
const errorHandler = require("./src/middleware/error.middleware");

const app = express();
const port = process.env.PORT || 5000;

// List all the frontend URLs that are allowed to access your API
const allowedOrigins = [
  process.env.FRONTEND_URL,    // Your live Vercel URL
  'http://localhost:5173'      // Your local development URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Allow larger JSON payloads so base64 images can be sent safely
app.use(express.json({ limit: "5mb" }));

// A root route to confirm the API is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Markify API is running successfully.' });
});

// Your API routes
const encryptResponse = require("./src/middleware/encryptionMiddleware");
const rateLimitMiddleware = require("./src/middleware/rateLimitMiddleware");
const cacheMiddleware = require("./src/middleware/cacheMiddleware");

// Apply rate limiting to all API routes
app.use('/api', rateLimitMiddleware);

// Apply encryption to all API routes (DISABLED - breaking frontend)
// app.use('/api', encryptResponse);

app.use('/api/preview', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);

// Apply caching to blog routes (cache for 60 seconds)
app.use('/api/blog', cacheMiddleware(60), blogRoutes);

app.use('/api/gemini', geminiRoutes);

app.use(errorHandler);

// This part is for local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`)
  })
}

// Export the app for Vercel
module.exports = app;
