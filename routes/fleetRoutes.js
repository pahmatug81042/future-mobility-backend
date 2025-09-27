const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const { getFleets, createFleet, updateFleet, deleteFleet } = require("../controllers/fleetController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getFleets);

router.post(
    "/",
    protect,
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("ownerType").isIn(["company", "government"]).withMessage("Owner type must be company or government"),
        body("ownerId").notEmpty().withMessage("Owner ID is required"),
        body("vehicleType").isIn(["bus", "train", "tram", "bike", "scooter", "car", "drone", "other"]).withMessage("Invalid vehicle type"),
        body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1")
    ],
    validateRequest,
    createFleet
);

router.put("/:id", protect, updateFleet);
router.delete("/:id", protect, deleteFleet);

module.exports = router;