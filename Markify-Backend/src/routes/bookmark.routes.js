const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');

router.patch('/:bookmarkId', protect, bookmarkController.updateBookmark);
router.delete('/:bookmarkId', protect, bookmarkController.deleteBookmark);


// --- CORRECTED EXPORT AND IMPORT ROUTES ---
// The main routes for JSON
router.get('/export', protect, bookmarkController.exportBookmarksJSON); // Changed from exportBookmarks
router.post('/import', protect, bookmarkController.importBookmarks);

// The specific format routes
router.get('/export/html', protect, bookmarkController.exportBookmarksHTML);
router.get('/export/csv', protect, bookmarkController.exportBookmarksCSV);
router.post('/import/html', protect, bookmarkController.importBookmarksHTML);
router.post('/import/csv', protect, bookmarkController.importBookmarksCSV);

module.exports = router;