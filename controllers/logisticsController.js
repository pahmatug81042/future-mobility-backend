const asyncHandler = require("express-async-handler");
const Logistics = require("../models/logisticsModel");
const sanitizeHtml = require("sanitize-html");

// @desc    Get all logistics entries with optional filter, pagination, and sorting
// @route   GET /api/logistics
// @access  Private/Admin
const getLogistics = asyncHandler(async (req, res) => {
    const { fleetId, transportId, status, page = 1, limit = 10, sortBy } = req.query;

    const filter = {};
    if (fleetId) filter.fleetId = fleetId;
    if (transportId) filter.transportId = transportId;
    if (status) filter.status = status;

    let sort = {};
    if (sortBy) {
        const [field, order] = sortBy.split(":");
        sort[field] = order === "desc" ? -1 : 1;
    } else {
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const logistics = await Logistics.find(filter)
        .populate("fleetId", "name vehicleType ownerType")
        .populate("transportId", "name type capacity sustainabilityScore")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    const total = await Logistics.countDocuments(filter);

    res.status(200).json({
        data: logistics,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
});

// @desc    Create new logistics entry
// @route   POST /api/logistics
// @access  Private/Admin
const createLogistics = asyncHandler(async (req, res) => {
    const fleetId = req.body.fleetId;
    const transportId = req.body.transportId;
    const route = sanitizeHtml(req.body.route);
    const utilization = req.body.utilization || 0;
    const sustainabilityScore = req.body.sustainabilityScore || 0;
    const status = req.body.status || "active";

    const logistics = new Logistics({ fleetId, transportId, route, utilization, sustainabilityScore, status });
    const createdLogistics = await logistics.save();
    res.status(201).json(createdLogistics);
});

// @desc    Update logistics entry
// @route   PUT /api/logistics/:id
// @access  Private/Admin
const updateLogistics = asyncHandler(async (req, res) => {
    const logistics = await Logistics.findById(req.params.id);
    if (!logistics) { res.status(404); throw new Error("Logistics entry not found"); }

    logistics.fleetId = req.body.fleetId || logistics.fleetId;
    logistics.transportId = req.body.transportId || logistics.transportId;
    logistics.route = sanitizeHtml(req.body.route) || logistics.route;
    logistics.utilization = req.body.utilization ?? logistics.utilization;
    logistics.sustainabilityScore = req.body.sustainabilityScore ?? logistics.sustainabilityScore;
    logistics.status = req.body.status || logistics.status;

    const updatedLogistics = await logistics.save();
    res.status(200).json(updatedLogistics);
});

// @desc    Delete logistics entry
// @route   DELETE /api/logistics/:id
// @access  Private/Admin
const deleteLogistics = asyncHandler(async (req, res) => {
    const logistics = await Logistics.findById(req.params.id);
    if (!logistics) { res.status(404); throw new Error("Logistics entry not found"); }
    await logistics.remove();
    res.status(200).json({ message: "Logistics entry removed" });
});

module.exports = { getLogistics, createLogistics, updateLogistics, deleteLogistics };