// attack-executor/src/app.js
const express = require("express");
const cors = require("cors");
const attackRoutes = require("./routes/attackRoutes");
const { AttackValidationError } = require("./utils/validation");

const app = express();

// Middleware
app.use(cors()); // Allow main backend to call this service
app.use(express.json());

// API Routes
app.use("/", attackRoutes); // Base path for attack execution

// Error handling middleware for this service
app.use((err, req, res, next) => {
    console.error("Attack Executor Error:", err);
    if (err instanceof AttackValidationError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(err.statusCode || 500).json({
        message: "An internal error occurred in the attack executor",
        error: process.env.NODE_ENV === "development" ? err.message : {}
    });
});

module.exports = app;