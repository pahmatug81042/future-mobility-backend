const express = require("express");
const router = express.Router();
const { registerUser, authUser, getMe, logoutUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", authUser);

// Get current logged-in user
router.get("/me", protect, getMe);

// Logout
router.post("/logout", logoutUser);

module.exports = router;