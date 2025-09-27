const mongoose = require("mongoose");

const fleetSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        ownerType: {
            type: String,
            enum: ["company", "government"],
            required: true
        },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        vehicleType: {
            type: String,
            enum: ["bus", "train", "tram", "bike", "scooter", "car", "drone", "other"],
            required: true
        },
        capacity: { type: Number, required: true, min: 1 },
        status: {
            type: String,
            enum: ["active", "inactive", "maintenance"],
            default: "active"
        },
        assignedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transport" }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Fleet", fleetSchema);