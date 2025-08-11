const express = require("express");
const router = express.Router();

// Staff Management API
router.use("/staff", require("./staffRoutes"));

// User Authentication and Management API (Placeholder)
router.use("/users", require("./userRoutes"));

// Simulation Configuration and Management API (Placeholder)
router.use("/simulations", require("./simulationRoutes"));

// Agent Management and Communication API (Placeholder - for main backend's role)
router.use("/agents", require("./agentRoutes"));

// Reporting and Analytics API (Placeholder)
// router.use("/reports", require("./reportRoutes"));

router.use("/attack-logs", require("./attackLogRoutes"));

module.exports = router;