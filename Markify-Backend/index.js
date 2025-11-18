require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoutes = require('./src/routes/user.routes');
const bookmarkRoutes = require('./src/routes/bookmark.routes');
const previewRoutes = require('./src/routes/preview.routes');
const collectionRoutes = require('./src/routes/collection.routes');
const blogRoutes = require('./src/routes/blog.routes');
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

app.use(express.json());

// A root route to confirm the API is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Markify API is running successfully.' });
});

// Your API routes
app.use('/api/preview', previewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/blog', blogRoutes);

app.use(errorHandler);

// This part is for local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`)
  })
}

// Export the app for Vercel
module.exports = app;
