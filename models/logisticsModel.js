const mongoose = require("mongoose");

const logisticsSchema = mongoose.Schema(
    {
        fleetId: { type: mongoose.Schema.Types.ObjectId, ref: "Fleet", required: true },
        transportId: { type: mongoose.Schema.Types.ObjectId, ref: "Transport", required: true },
        route: { type: String, required: true, trim: true },
        utilization: { type: Number, default: 0, min: 0, max: 100 }, // % utilization
        sustainabilityScore: { type: Number, default: 0, min: 0, max: 100 },
        status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Logistics", logisticsSchema);