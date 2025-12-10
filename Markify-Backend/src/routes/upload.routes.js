
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const uploadController = require('../controllers/upload.controller');

router.post('/', protect, uploadController.uploadFile);

module.exports = router;
