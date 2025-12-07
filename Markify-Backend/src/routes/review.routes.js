const express = require('express');
const router = express.Router();
const { createReview, getReviews, getMyReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route - get all reviews
router.get('/', getReviews);

// Protected routes - require authentication
router.get('/me', protect, getMyReview);
router.post('/', protect, createReview);

module.exports = router;
