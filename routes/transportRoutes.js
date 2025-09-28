const express = require("express");
const router = express.Router();
const {
    createTransport,
    getTransports,
    getTransportById,   // import
    updateTransport,
    deleteTransport,
} = require("../controllers/transportController");
const { protect } = require("../middleware/authMiddleware");

// POST & GET all
router.route("/")
    .post(protect, createTransport)
    .get(protect, getTransports);

// GET by ID, PUT, DELETE
router.route("/:id")
    .get(protect, getTransportById)  // add this line
    .put(protect, updateTransport)
    .delete(protect, deleteTransport);

module.exports = router;