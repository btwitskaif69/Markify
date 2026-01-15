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
const reviewRoutes = require('./src/routes/review.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const contactRoutes = require('./src/routes/contact.routes');
const errorHandler = require("./src/middleware/error.middleware");

const app = express();
const port = process.env.PORT || 5000;

// List all the frontend URLs that are allowed to access your API
const allowedOrigins = [
  process.env.FRONTEND_URL,    // Your live Vercel URL
  'https://www.markify.tech',  // Production Domain
  'https://markify.tech',      // Production Domain (non-www)
  'http://localhost:5173',     // Your local development URL
  'http://localhost:5174'      // Alternative local dev port
].filter(Boolean); // Filter out undefined values (e.g. if env var is missing)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Allow larger JSON payloads so base64 images can be sent safely
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// A root route to confirm the API is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Markify API is running successfully.' });
});

// Your API routes
const encryptResponse = require("./src/middleware/encryptionMiddleware");
const rateLimitMiddleware = require("./src/middleware/rateLimitMiddleware");
const cacheMiddleware = require("./src/middleware/cacheMiddleware");
const wafMiddleware = require("./src/middleware/wafMiddleware");

// Apply WAF protection to all API routes (must be before other middleware)
app.use('/api', wafMiddleware);

// Apply rate limiting to all API routes
app.use('/api', rateLimitMiddleware);

// Apply encryption to all API routes (DISABLED - breaking frontend)
// app.use('/api', encryptResponse);

app.use('/api/preview', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);

// Apply caching to blog routes (MOVED TO ROUTER LEVEL)
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);

app.use('/api/gemini', geminiRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

// Start server only in local development (not on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`)
  });
}

// Export the app for Vercel
module.exports = app;
