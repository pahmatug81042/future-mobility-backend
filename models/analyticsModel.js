const mongoose = require("mongoose");

const analyticsSchema = mongoose.Schema(
    {
        fleetId: { type: mongoose.Schema.Types.ObjectId, ref: "Fleet", required: true },
        transportId: { type: mongoose.Schema.Types.ObjectId, ref: "Transport", required: true },
        logisticsId: { type: mongoose.Schema.Types.ObjectId, ref: "Logistics", required: false },
        metricType: {
            type: String,
            enum: ["utilization", "sustainability", "status"],
            required: true
        },
        value: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);