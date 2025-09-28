const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

/**
 * Security middleware
 * Applies security headers and sanitization, but does NOT apply CORS
 */
const securityMiddleware = (app) => {
    app.use(helmet()); // Secure HTTP headers
    app.use(mongoSanitize()); // Prevent MongoDB operator injection
};

module.exports = securityMiddleware;