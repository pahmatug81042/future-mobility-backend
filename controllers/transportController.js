const asyncHandler = require("express-async-handler");
const Transport = require("../models/transportModel");
const sanitizeHtml = require("sanitize-html");

// @desc    Get all transports with filter, pagination, and sorting
// @route   GET /api/transports
// @access  Public
const getTransports = asyncHandler(async (req, res) => {
    const { type, status, name, sortBy, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (name) filter.name = { $regex: sanitizeHtml(name), $options: "i" }; // partial match

    // Build sort object
    let sort = {};
    if (sortBy) {
        const [field, order] = sortBy.split(":"); // e.g., sustainabilityScore:desc
        sort[field] = order === "desc" ? -1 : 1;
    } else {
        sort = { createdAt: -1 }; // default newest first
    }

    const skip = (page - 1) * limit;
    const transports = await Transport.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    const total = await Transport.countDocuments(filter);

    res.status(200).json({
        data: transports,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
});