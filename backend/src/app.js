// backend/src/app.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const db = require("./config/db"); // Ensure DB connection is established

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// Debug logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Attach db connection to request for easy access in routes/models
app.use((req, res, next) => {
    req.db = db;
    next();
});

// API Routes
app.use("/api", routes);

// Health check route (moved inside /api)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Backend server is healthy" });
});

// Root route (optional, can be removed if not needed)
app.get("/", (req, res) => {
    res.json({ message: "Backend API is running" });
});

// Catch-all for undefined routes
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
