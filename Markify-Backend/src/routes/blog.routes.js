const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const { protect } = require("../middleware/auth.middleware");

const cacheMiddleware = require("../middleware/cacheMiddleware");

// Public blog routes
router.get("/", cacheMiddleware(60), blogController.getPublishedPosts);
router.get("/me/list", protect, blogController.getMyPosts);
router.get("/:slug", cacheMiddleware(60), blogController.getPostBySlug);

// Authenticated author routes
router.post("/", protect, blogController.createPost);
router.patch("/:postId", protect, blogController.updatePost);
router.delete("/:postId", protect, blogController.deletePost);

module.exports = router;
