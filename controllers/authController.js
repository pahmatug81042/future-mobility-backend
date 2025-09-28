const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const sanitizeHtml = require("sanitize-html");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const name = sanitizeHtml(req.body.name, { allowedTags: [], allowedAttributes: {} });
    const email = sanitizeHtml(req.body.email, { allowedTags: [], allowedAttributes: {} });
    const password = req.body.password;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email, and password are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // ✅ Remove manual hashing — Mongoose pre-save will hash the password automatically
    const user = await User.create({ name, email, password });

    if (!user) {
        res.status(400);
        throw new Error("Invalid user data");
    }

    // Set JWT in HttpOnly cookie
    res.cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email } });
});

// @desc    Authenticate user & set token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const email = sanitizeHtml(req.body.email, { allowedTags: [], allowedAttributes: {} });
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email } });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Not authorized");
    }
    res.status(200).json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email } });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { registerUser, authUser, getMe, logoutUser };