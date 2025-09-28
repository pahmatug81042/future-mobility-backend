const express = require("express");
const router = express.Router();
const {
    getFleets,
    getFleetById,
    createFleet,
    updateFleet,
    deleteFleet
} = require("../controllers/fleetController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
    .get(protect, getFleets)
    .post(protect, createFleet);

router.route("/:id")
    .get(protect, getFleetById)   // 👈 This is missing for you
    .put(protect, updateFleet)
    .delete(protect, deleteFleet);

module.exports = router;v