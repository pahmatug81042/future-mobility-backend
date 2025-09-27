const mongoose = require("mongoose");

const transportSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        type: {
            type: String,
            enum: ["bus", "train", "tram", "bike", "scooter", "car", "plane", "drone", "other"],
            required: true
        },
        capacity: { type: Number, required: true, min: 1 },
        sustainabilityScore: { type: Number, default: 0, min: 0, max: 100 },
        status: {
            type: String,
            enum: ["active", "inactive", "maintenance"],
            default: "active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transport", transportSchema);