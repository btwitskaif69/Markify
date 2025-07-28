// src/routes/bookmark.routes.js
const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');

// This name must match the export: bookmarkController.addBookmark
router.post('/users/:userId/bookmarks', bookmarkController.addBookmark);

module.exports = router;