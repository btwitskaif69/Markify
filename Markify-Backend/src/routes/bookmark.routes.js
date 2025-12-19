const express = require('express');

const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

router.patch('/:bookmarkId', protect, bookmarkController.updateBookmark);
router.delete('/:bookmarkId', protect, bookmarkController.deleteBookmark);
router.post('/:bookmarkId/fetch-preview', protect, bookmarkController.fetchBookmarkPreview);
router.get('/export', protect, bookmarkController.exportBookmarks);
router.post('/import', protect, bookmarkController.importBookmarks);
router.post('/sync-local', protect, bookmarkController.syncLocalBookmarks);
router.post('/bulk-delete', protect, bookmarkController.bulkDeleteBookmarks);
router.post('/extract-metadata', protect, bookmarkController.extractUrlMetadata);

// Share routes
router.post('/:bookmarkId/share', protect, bookmarkController.toggleShareBookmark);
router.get('/shared/:shareId', bookmarkController.getSharedBookmark); // Public - no auth

module.exports = router;