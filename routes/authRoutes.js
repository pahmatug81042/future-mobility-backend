const express = require("express");
const router = express.Router();
const { registerUser, authUser } = require("../controllers/authController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

router.post(
    "/register",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")
    ],
    validateRequest,
    registerUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    validateRequest,
    authUser
);

module.exports = router;