const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

const securityMiddleware = (app) => {
    app.use(helmet());            // Set secure headers
    app.use(mongoSanitize());     // Prevent NoSQL injection
    app.use(cors());              // Enable CORS
};

module.exports = securityMiddleware;