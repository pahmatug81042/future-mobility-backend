const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sanitizeHtml = require("sanitize-html");

const registerUser = asyncHandler(async (req, res) => {
    const name = sanitizeHtml(req.body.name);
    const email = req.body.email;
    const password = req.body.password;

    res.status(200).json({ message: `User input sanitized: ${name}, ${email}` });
});

const authUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    res.status(200).json({ message: `Login input sanitized: ${email}` });
});

module.exports = { registerUser, authUser };