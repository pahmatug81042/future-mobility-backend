const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createAnalytics,
    getAverageUtilization,
    getSustainabilityReport,
    getStatusSummary,
    getFleetUtilization,
    getTransportSummary,
    getAnalyticsSummary
} = require("../controllers/analyticsController");

// Create a new analytics entry
router.post("/", protect, createAnalytics);

// Analytics endpoints
router.get("/utilization", protect, getAverageUtilization);
router.get("/sustainability", protect, getSustainabilityReport);
router.get("/status-summary", protect, getStatusSummary);
router.get("/fleet-utilization", protect, getFleetUtilization);
router.get("/transport-summary", protect, getTransportSummary);

// ======================= NEW =======================
router.get("/summary", protect, getAnalyticsSummary);

module.exports = router;