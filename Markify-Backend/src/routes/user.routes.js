const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const bookmarkController = require('../controllers/bookmark.controller'); // Make sure this import is correct

// Routes for creating users
router.post('/', userController.createUser);
router.post('/batch', userController.createManyUsers);

// Routes for a specific user's bookmarks
router.get('/:userId/bookmarks', bookmarkController.getBookmarksForUser);
router.post('/:userId/bookmarks', bookmarkController.addBookmark);

module.exports = router;