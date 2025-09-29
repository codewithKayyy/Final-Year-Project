// backend/src/routes/index.js
const express = require("express");
const router = express.Router();

// Staff Management API
router.use("/staff", require("./staffRoutes"));

// User Authentication and Management API (Placeholder)
router.use("/users", require("./userRoutes"));

// Campaign Management API
router.use("/campaigns", require("./campaignRoutes"));

// Simulation Configuration and Management API (Placeholder)
router.use("/simulations", require("./simulationRoutes")); // CRUD endpoints (list, get, update, delete)

router.use("/simulations", require("./simulationControlRoutes")); //Start/stop simulation commands

// Agent Management and Communication API (Placeholder - for main backend's role)
router.use("/agents", require("./agentRoutes"));

// Reporting and Analytics API (Placeholder)
// router.use("/reports", require("./reportRoutes"));

router.use("/attack-logs", require("./attackLogRoutes"));

// Phishing Email Templates API
router.use("/phishing-emails", require("./phishingEmailRoutes"));

// System Health and Metrics API
router.use("/system", require("./systemRoutes"));

// Telemetry API
router.use("/telemetry", require("./telemetryRoutes"));

module.exports = router;