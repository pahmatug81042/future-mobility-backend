const asyncHandler = require("express-async-handler");
const Analytics = require("../models/analyticsModel");
const Logistics = require("../models/logisticsModel");
const Fleet = require("../models/fleetModel");
const Transport = require("../models/transportModel");

// @desc    Create a new analytics entry
// @route   POST /api/analytics
// @access  Private/Admin
const createAnalytics = asyncHandler(async (req, res) => {
    const { fleetId, transportId, logisticsId, metricType, value } = req.body;

    // Validate required fields
    if (!fleetId || !transportId || !metricType || value === undefined) {
        res.status(400);
        throw new Error("fleetId, transportId, metricType, and value are required");
    }

    const analytics = new Analytics({
        fleetId,
        transportId,
        logisticsId,
        metricType,
        value,
    });

    const createdAnalytics = await analytics.save();
    res.status(201).json(createdAnalytics);
});

// @desc    Get average utilization per transport type
// @route   GET /api/analytics/utilization
// @access  Private/Admin
const getAverageUtilization = asyncHandler(async (req, res) => {
    const aggregation = await Analytics.aggregate([
        { $match: { metricType: "utilization" } },
        {
            $lookup: {
                from: "transports",
                localField: "transportId",
                foreignField: "_id",
                as: "transport"
            }
        },
        { $unwind: "$transport" },
        {
            $group: {
                _id: "$transport.type",
                avgUtilization: { $avg: "$value" },
                totalVehicles: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ data: aggregation });
});

// @desc    Get sustainability report
// @route   GET /api/analytics/sustainability
// @access  Private/Admin
const getSustainabilityReport = asyncHandler(async (req, res) => {
    const aggregation = await Analytics.aggregate([
        { $match: { metricType: "sustainability" } },
        {
            $group: {
                _id: null,
                avgSustainability: { $avg: "$value" },
                maxSustainability: { $max: "$value" },
                minSustainability: { $min: "$value" }
            }
        }
    ]);

    res.status(200).json({ data: aggregation[0] || {} });
});

// @desc    Get status summary
// @route   GET /api/analytics/status-summary
// @access  Private/Admin
const getStatusSummary = asyncHandler(async (req, res) => {
    const aggregation = await Analytics.aggregate([
        { $match: { metricType: "status" } },
        {
            $group: {
                _id: "$value",
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({ data: aggregation });
});

// @desc    Get fleet utilization
// @route   GET /api/analytics/fleet-utilization
// @access  Private/Admin
const getFleetUtilization = asyncHandler(async (req, res) => {
    const fleets = await Fleet.find({});
    const data = await Promise.all(fleets.map(async (fleet) => {
        const analytics = await Analytics.find({ fleetId: fleet._id, metricType: "utilization" });
        const avgUtilization = analytics.length > 0
            ? analytics.reduce((sum, a) => sum + a.value, 0) / analytics.length
            : 0;
        return {
            _id: fleet._id,
            name: fleet.name,
            utilization: avgUtilization
        };
    }));
    res.json(data);
});

// @desc    Get transport summary
// @route   GET /api/analytics/transport-summary
// @access  Private/Admin
const getTransportSummary = asyncHandler(async (req, res) => {
    const transports = await Transport.find({}).populate("fleetId", "name");
    const data = await Promise.all(transports.map(async (transport) => {
        const analytics = await Analytics.find({ transportId: transport._id });
        const utilizationAnalytics = analytics.filter(a => a.metricType === "utilization");
        const avgUtilization = utilizationAnalytics.length > 0
            ? utilizationAnalytics.reduce((sum, a) => sum + a.value, 0) / utilizationAnalytics.length
            : 0;
        return {
            _id: transport._id,
            name: transport.name,
            status: transport.status,
            capacity: transport.capacity,
            fleetName: transport.fleetId ? transport.fleetId.name : "Unassigned",
            avgUtilization
        };
    }));
    res.json(data);
});

module.exports = {
    createAnalytics,
    getAverageUtilization,
    getSustainabilityReport,
    getStatusSummary,
    getFleetUtilization,
    getTransportSummary
};