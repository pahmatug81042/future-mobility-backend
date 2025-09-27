const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const { getLogistics, createLogistics, updateLogistics, deleteLogistics } = require("../controllers/logisticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getLogistics);

router.post(
    "/",
    protect,
    [
        body("fleetId").notEmpty().withMessage("Fleet ID is required"),
        body("transportId").notEmpty().withMessage("Transport ID is required"),
        body("route").trim().notEmpty().withMessage("Route is required"),
        body("utilization").optional().isInt({ min: 0, max: 100 }),
        body("sustainabilityScore").optional().isInt({ min: 0, max: 100 }),
        body("status").optional().isIn(["active", "inactive", "maintenance"])
    ],
    validateRequest,
    createLogistics
);

router.put("/:id", protect, updateLogistics);
router.delete("/:id", protect, deleteLogistics);

module.exports = router;