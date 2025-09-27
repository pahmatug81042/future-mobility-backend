const asyncHandler = require("express-async-handler");
const Fleet = require("../models/fleetModel");
const sanitizeHtml = require("sanitize-html");

// @desc    Get all fleet vehicles
// @route   GET /api/fleets
// @access  Private/Admin
const getFleets = asyncHandler(async (req, res) => {
    const fleets = await Fleet.find({}).populate("ownerId", "name email").populate("assignedRoutes", "name type");
    res.status(200).json(fleets);
});

// @desc    Create new fleet vehicle
// @route   POST /api/fleets
// @access  Private/Admin
const createFleet = asyncHandler(async (req, res) => {
    const name = sanitizeHtml(req.body.name);
    const ownerType = req.body.ownerType;
    const ownerId = req.body.ownerId;
    const vehicleType = req.body.vehicleType;
    const capacity = req.body.capacity;
    const status = req.body.status || "active";
    const assignedRoutes = req.body.assignedRoutes || [];

    const fleet = new Fleet({ name, ownerType, ownerId, vehicleType, capacity, status, assignedRoutes });
    const createdFleet = await fleet.save();
    res.status(201).json(createdFleet);
});

// @desc    Update fleet vehicle
// @route   PUT /api/fleets/:id
// @access  Private/Admin
const updateFleet = asyncHandler(async (req, res) => {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) {
        res.status(404);
        throw new Error("Fleet not found");
    }

    fleet.name = sanitizeHtml(req.body.name) || fleet.name;
    fleet.ownerType = req.body.ownerType || fleet.ownerType;
    fleet.vehicleType = req.body.vehicleType || fleet.vehicleType;
    fleet.capacity = req.body.capacity || fleet.capacity;
    fleet.status = req.body.status || fleet.status;
    fleet.assignedRoutes = req.body.assignedRoutes || fleet.assignedRoutes;

    const updatedFleet = await fleet.save();
    res.status(200).json(updatedFleet);
});

// @desc    Delete fleet vehicle
// @route   DELETE /api/fleets/:id
// @access  Private/Admin
const deleteFleet = asyncHandler(async (req, res) => {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) {
        res.status(404);
        throw new Error("Fleet not found");
    }

    await fleet.remove();
    res.status(200).json({ message: "Fleet vehicle removed" });
});

module.exports = { getFleets, createFleet, updateFleet, deleteFleet };