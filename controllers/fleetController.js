const asyncHandler = require("express-async-handler");
const Fleet = require("../models/fleetModel");
const sanitizeHtml = require("sanitize-html");

const getFleets = asyncHandler(async (req, res) => {
    const { ownerType, vehicleType, status, name, sortBy, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (ownerType) filter.ownerType = ownerType;
    if (vehicleType) filter.vehicleType = vehicleType;
    if (status) filter.status = status;
    if (name) filter.name = { $regex: sanitizeHtml(name), $options: "i" };
    let sort = {};
    if (sortBy) {
        const [field, order] = sortBy.split(":");
        sort[field] = order === "desc" ? -1 : 1;
    } else sort = { createdAt: -1 };
    const skip = (page - 1) * limit;
    const fleets = await Fleet.find(filter)
        .populate("ownerId", "name email")
        .populate("assignedRoutes", "name type")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));
    const total = await Fleet.countDocuments(filter);
    res.status(200).json({ data: fleets, page: Number(page), totalPages: Math.ceil(total / limit), totalItems: total });
});

const createFleet = asyncHandler(async (req, res) => {
    const fleet = new Fleet({
        name: sanitizeHtml(req.body.name),
        ownerType: req.body.ownerType,
        ownerId: req.body.ownerId,
        vehicleType: req.body.vehicleType,
        capacity: req.body.capacity,
        status: req.body.status || "active",
        assignedRoutes: req.body.assignedRoutes || []
    });
    const createdFleet = await fleet.save();
    res.status(201).json(createdFleet);
});

const updateFleet = asyncHandler(async (req, res) => {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) { res.status(404); throw new Error("Fleet not found"); }
    fleet.name = sanitizeHtml(req.body.name) || fleet.name;
    fleet.ownerType = req.body.ownerType || fleet.ownerType;
    fleet.vehicleType = req.body.vehicleType || fleet.vehicleType;
    fleet.capacity = req.body.capacity || fleet.capacity;
    fleet.status = req.body.status || fleet.status;
    fleet.assignedRoutes = req.body.assignedRoutes || fleet.assignedRoutes;
    const updatedFleet = await fleet.save();
    res.status(200).json(updatedFleet);
});

const deleteFleet = asyncHandler(async (req, res) => {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) { res.status(404); throw new Error("Fleet not found"); }
    await fleet.deleteOne();
    res.status(200).json({ message: "Fleet vehicle removed" });
});

// @desc    Get a fleet by ID
// @route   GET /api/fleets/:id
// @access  Private
const getFleetById = asyncHandler(async (req, res) => {
    const fleet = await Fleet.findById(req.params.id).populate("assignedRoutes");
    if (!fleet) {
        res.status(404);
        throw new Error("Fleet not found");
    }
    res.json(fleet);
});

module.exports = { getFleets, createFleet, updateFleet, deleteFleet, getFleetById };