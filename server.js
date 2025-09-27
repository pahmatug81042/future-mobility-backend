const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors"); // <-- add CORS
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const securityMiddleware = require("./middleware/securityMiddleware");

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// CORS setup for frontend with credentials
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies/auth headers
}));

// Security
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