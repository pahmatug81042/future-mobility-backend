const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getAverageUtilization,
    getSustainabilityReport,
    getStatusSummary
} = require("../controllers/analyticsController");

router.get("/utilization", protect, getAverageUtilization);
router.get("/sustainability", protect, getSustainabilityReport);
router.get("/status-summary", protect, getStatusSummary);

module.exports = router;