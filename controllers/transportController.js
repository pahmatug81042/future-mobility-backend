const asyncHandler = require("express-async-handler");
const Transport = require("../models/transportModel");
const sanitizeHtml = require("sanitize-html");

// @desc    Get all transports
// @route   GET /api/transports
// @access  Public
const getTransports = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get all transports endpoint placeholder" });
});

// @desc    Create new transport
// @route   POST /api/transports
// @access  Private/Admin
const createTransport = asyncHandler(async (req, res) => {
    const name = sanitizeHtml(req.body.name);
    const type = req.body.type;
    const capacity = req.body.capacity;

    res.status(201).json({ message: `Transport created placeholder: ${name}, ${type}, ${capacity}` });
});

// @desc    Update transport
// @route   PUT /api/transports/:id
// @access  Private/Admin
const updateTransport = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update transport ${req.params.id} placeholder` });
});

// @desc    Delete transport
// @route   DELETE /api/transports/:id
// @access  Private/Admin
const deleteTransport = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete transport ${req.params.id} placeholder` });
});

module.exports = { getTransports, createTransport, updateTransport, deleteTransport };