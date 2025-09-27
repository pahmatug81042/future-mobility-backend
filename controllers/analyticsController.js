const asyncHandler = require("express-async-handler");
const Logistics = require("../models/logisticsModel");
const Fleet = require("../models/fleetModel");
const Transport = require("../models/transportModel");

// @desc    Average fleet utilization per transport type
// @route   GET /api/analytics/utilization
// @access  Private/Admin
const getAverageUtilization = asyncHandler(async (req, res) => {
    const aggregation = await Logistics.aggregate([
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
                avgUtilization: { $avg: "$utilization" },
                totalVehicles: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ data: aggregation });
});

// @desc    Sustainability score report
// @route   GET /api/analytics/sustainability
// @access  Private/Admin
const getSustainabilityReport = asyncHandler(async (req, res) => {
    const aggregation = await Logistics.aggregate([
        {
            $group: {
                _id: null,
                avgSustainability: { $avg: "$sustainabilityScore" },
                maxSustainability: { $max: "$sustainabilityScore" },
                minSustainability: { $min: "$sustainabilityScore" }
            }
        }
    ]);

    res.status(200).json({ data: aggregation[0] || {} });
});

// @desc    Active/inactive vehicle summary
// @route   GET /api/analytics/status-summary
// @access  Private/Admin
const getStatusSummary = asyncHandler(async (req, res) => {
    const aggregation = await Logistics.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({ data: aggregation });
});

module.exports = { getAverageUtilization, getSustainabilityReport, getStatusSummary };