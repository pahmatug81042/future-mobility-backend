const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createLogistics,
    getLogistics,        // <-- rename here
    getLogisticsById,
    updateLogistics,
    deleteLogistics,
} = require("../controllers/logisticsController");

// Create
router.post("/", protect, createLogistics);

// Get all
router.get("/", protect, getLogistics);   // <-- use getLogistics

// Get by ID
router.get("/:id", protect, getLogisticsById);

// Update
router.put("/:id", protect, updateLogistics);

// Delete
router.delete("/:id", protect, deleteLogistics);

module.exports = router;