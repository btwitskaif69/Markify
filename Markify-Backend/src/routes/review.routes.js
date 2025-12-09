const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviews,
    getMyReview,
    getPendingReviews,
    approveReview,
    rejectReview,
    getPendingCount
} = require('../controllers/review.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public route - get all approved reviews
router.get('/', getReviews);

// Protected routes - require authentication
router.get('/me', protect, getMyReview);
router.post('/', protect, createReview);

// Admin-only routes
router.get('/pending', protect, adminOnly, getPendingReviews);
router.get('/pending/count', protect, adminOnly, getPendingCount);
router.patch('/:id/approve', protect, adminOnly, approveReview);
router.patch('/:id/reject', protect, adminOnly, rejectReview);

module.exports = router;
