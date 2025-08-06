const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

router.patch('/:bookmarkId', protect, bookmarkController.updateBookmark);
router.delete('/:bookmarkId', protect, bookmarkController.deleteBookmark);
router.get('/export', protect, bookmarkController.exportBookmarks);
router.post('/import', protect, bookmarkController.importBookmarks);

module.exports = router;