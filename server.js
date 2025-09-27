const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const securityMiddleware = require("./middleware/securityMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Security Middlewares
securityMiddleware(app);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transports", require("./routes/transportRoutes"));

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));