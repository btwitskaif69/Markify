const express = require("express");
const router = express.Router();
const geminiController = require("../controllers/gemini.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/refactor", protect, geminiController.refactorDescription);

module.exports = router;
