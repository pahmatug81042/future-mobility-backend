const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getAverageUtilization,
    getSustainabilityReport,
    getStatusSummary,
    getFleetUtilization,
    getTransportSummary
} = require("../controllers/analyticsController");

router.get("/utilization", protect, getAverageUtilization);
router.get("/sustainability", protect, getSustainabilityReport);
router.get("/status-summary", protect, getStatusSummary);
router.get("/fleet-utilization", protect, getFleetUtilization);
router.get("/transport-summary", protect, getTransportSummary);

module.exports = router;