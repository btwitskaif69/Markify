const express = require('express');
const router = express.Router();
const previewController = require('../controllers/preview.controller');

// GET /api/preview?url=https://example.com
router.get('/preview', previewController.fetchLinkPreview);

module.exports = router;