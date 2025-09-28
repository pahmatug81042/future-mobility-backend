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

    // Return array directly for easier frontend mapping
    res.status(200).json(aggregation);
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

    res.status(200).json(aggregation[0] || {});
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

    res.status(200).json(aggregation);
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

// @desc    Get transport summary (bulletproof version)
// @route   GET /api/analytics/transport-summary
// @access  Private/Admin
const getTransportSummary = asyncHandler(async (req, res) => {
    try {
        // Fetch all transports with fleet info populated if exists
        const transports = await Transport.find({}).populate("fleetId", "name");

        // Map through transports safely
        const data = await Promise.all(transports.map(async (transport) => {
            // Guard against missing transport or invalid _id
            const transportId = transport?._id;
            if (!transportId) return null;

            // Fetch analytics related to this transport
            let analytics = [];
            try {
                analytics = await Analytics.find({ transportId });
            } catch (err) {
                console.warn(`Failed to fetch analytics for transport ${transportId}:`, err.message);
                analytics = [];
            }

            // Calculate average utilization safely
            const utilizationAnalytics = Array.isArray(analytics)
                ? analytics.filter(a => a.metricType === "utilization")
                : [];

            const avgUtilization = utilizationAnalytics.length > 0
                ? utilizationAnalytics.reduce((sum, a) => sum + (a.value || 0), 0) / utilizationAnalytics.length
                : 0;

            return {
                _id: transportId,
                name: transport?.name || "Unnamed Transport",
                status: transport?.status || "Unknown",
                capacity: transport?.capacity || 0,
                fleetName: transport?.fleetId?.name || "Unassigned",
                avgUtilization
            };
        }));

        // Filter out any null results in case of missing transport IDs
        res.json(data.filter(item => item !== null));
    } catch (error) {
        console.error("Transport Summary Error:", error);
        res.status(200).json([]); // Always return empty array instead of 500
    }
});

// ======================= NEW =======================

// @desc    Get overall analytics summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getAnalyticsSummary = asyncHandler(async (req, res) => {
    const fleets = await Fleet.find({});
    const transports = await Transport.find({});
    const sustainability = await Analytics.aggregate([
        { $match: { metricType: "sustainability" } },
        { $group: { _id: null, avgSustainability: { $avg: "$value" } } },
    ]);

    res.json({
        totalFleets: fleets.length,
        totalTransports: transports.length,
        avgSustainabilityScore: Math.round(sustainability[0]?.avgSustainability || 0),
    });
});

module.exports = {
    createAnalytics,
    getAverageUtilization,
    getSustainabilityReport,
    getStatusSummary,
    getFleetUtilization,
    getTransportSummary,
    getAnalyticsSummary, // <-- export new summary endpoint
};