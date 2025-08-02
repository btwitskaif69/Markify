const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const bookmarkController = require('../controllers/bookmark.controller');

// Routes for creating users
router.post('/', userController.createUser);
router.post('/batch', userController.createManyUsers);

// --- ADD THIS LOGIN ROUTE ---
router.post('/login', userController.loginUser);

// Routes for a specific user's bookmarks
router.get('/:userId/bookmarks', bookmarkController.getBookmarksForUser);
router.post('/:userId/bookmarks', bookmarkController.addBookmark);

module.exports = router;