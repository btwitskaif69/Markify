const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');

// The path for update is just '/:bookmarkId', not '/bookmarks/:bookmarkId'
router.patch('/:bookmarkId', bookmarkController.updateBookmark);

// The path for delete is also just '/:bookmarkId'
router.delete('/:bookmarkId', bookmarkController.deleteBookmark);

module.exports = router;