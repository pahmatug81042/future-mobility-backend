const asyncHandler = require("express-async-handler");
const Transport = require("../models/transportModel");
const sanitizeHtml = require("sanitize-html");

const getTransports = asyncHandler(async (req, res) => {
    const { type, status, name, sortBy, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (name) filter.name = { $regex: sanitizeHtml(name), $options: "i" };
    let sort = {};
    if (sortBy) {
        const [field, order] = sortBy.split(":");
        sort[field] = order === "desc" ? -1 : 1;
    } else sort = { createdAt: -1 };
    const skip = (page - 1) * limit;
    const transports = await Transport.find(filter).sort(sort).skip(skip).limit(Number(limit));
    const total = await Transport.countDocuments(filter);
    res.status(200).json({ data: transports, page: Number(page), totalPages: Math.ceil(total / limit), totalItems: total });
});

const createTransport = asyncHandler(async (req, res) => {
    const name = sanitizeHtml(req.body.name);
    const type = req.body.type;
    const capacity = req.body.capacity;
    const sustainabilityScore = req.body.sustainabilityScore || 0;
    const status = req.body.status || "active";
    const transport = new Transport({ name, type, capacity, sustainabilityScore, status });
    const createdTransport = await transport.save();
    res.status(201).json(createdTransport);
});

const updateTransport = asyncHandler(async (req, res) => {
    const transport = await Transport.findById(req.params.id);
    if (!transport) { res.status(404); throw new Error("Transport not found"); }
    transport.name = sanitizeHtml(req.body.name) || transport.name;
    transport.type = req.body.type || transport.type;
    transport.capacity = req.body.capacity || transport.capacity;
    transport.sustainabilityScore = req.body.sustainabilityScore ?? transport.sustainabilityScore;
    transport.status = req.body.status || transport.status;
    const updatedTransport = await transport.save();
    res.status(200).json(updatedTransport);
});

const deleteTransport = asyncHandler(async (req, res) => {
    const transport = await Transport.findById(req.params.id);
    if (!transport) { res.status(404); throw new Error("Transport not found"); }
    await transport.deleteOne();
    res.status(200).json({ message: "Transport removed" });
});

// @desc    Get single transport by ID
// @route   GET /api/transports/:id
// @access  Private
const getTransportById = asyncHandler(async (req, res) => {
    const transport = await Transport.findById(req.params.id);

    if (transport) {
        res.json(transport);
    } else {
        res.status(404);
        throw new Error("Transport not found");
    }
});

module.exports = { getTransports, createTransport, updateTransport, deleteTransport, getTransportById };