const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const {
    getTransports,
    createTransport,
    updateTransport,
    deleteTransport
} = require("../controllers/transportController");
const { protect } = require("../middleware/authMiddleware");

// Public route to get all transports
router.get("/", getTransports);

// Admin routes
router.post(
    "/",
    protect,
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("type").notEmpty().withMessage("Type is required"),
        body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1")
    ],
    validateRequest,
    createTransport
);

router.put("/:id", protect, updateTransport);
router.delete("/:id", protect, deleteTransport);

module.exports = router;