
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const uploadController = require('../controllers/upload.controller');

router.post('/', protect, uploadController.uploadFile);

module.exports = router;
