const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { protect } = require('../middleware/auth.middleware');

// All collection routes are protected
router.get('/', protect, collectionController.getCollections);
router.post('/', protect, collectionController.createCollection);
router.delete('/:collectionId', protect, collectionController.deleteCollection);
router.patch('/:collectionId', protect, collectionController.renameCollection);

// Share routes
router.post('/:collectionId/share', protect, collectionController.toggleShareCollection);
router.get('/shared/:shareId', collectionController.getSharedCollection); // Public - no auth

module.exports = router;