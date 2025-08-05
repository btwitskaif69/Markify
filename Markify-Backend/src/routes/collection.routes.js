const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { protect } = require('../middleware/auth.middleware');

// All collection routes are protected
router.get('/', protect, collectionController.getCollections);
router.post('/', protect, collectionController.createCollection);
router.delete('/:collectionId', protect, collectionController.deleteCollection);
router.patch('/:collectionId', protect, collectionController.renameCollection);

module.exports = router;