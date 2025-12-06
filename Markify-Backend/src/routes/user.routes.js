const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware'); // 1. Import the middleware

// --- Public Routes (No token needed) ---
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// --- Protected Routes (Token is required) ---
router.get('/profile', protect, userController.getUserProfile);
router.patch('/profile', protect, userController.updateUserProfile);
router.get('/:userId/bookmarks', protect, bookmarkController.getBookmarksForUser);
router.post('/:userId/bookmarks', protect, bookmarkController.addBookmark);

// This route can probably be removed or protected as well
router.post('/batch', userController.createManyUsers);

module.exports = router;