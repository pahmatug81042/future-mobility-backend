const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const securityMiddleware = require("./middleware/securityMiddleware");

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Allowed frontend origins
const allowedOrigins = ["http://localhost:5173"];

// CORS setup with credentials support
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow Postman or server-to-server requests
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true, // allow cookies/auth headers
};

// Handle preflight OPTIONS requests globally
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

// Apply security middleware AFTER CORS
securityMiddleware(app);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transports", require("./routes/transportRoutes"));
app.use("/api/fleets", require("./routes/fleetRoutes"));
app.use("/api/logistics", require("./routes/logisticsRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));