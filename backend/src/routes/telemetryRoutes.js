const express = require("express");
const router = express.Router();
const Telemetry = require("../models/Telemetry");

router.get("/agent/:agentId", async (req, res) => {
    try {
        const { agentId } = req.params;
        const { limit = 100 } = req.query;

        const telemetryData = await Telemetry.getByAgent(agentId, parseInt(limit));
        res.json(telemetryData);
    } catch (error) {
        console.error("Error fetching telemetry for agent:", error);
        res.status(500).json({
            message: "Failed to fetch telemetry data",
            error: error.message
        });
    }
});

router.get("/latest", async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const telemetryData = await Telemetry.getLatest(parseInt(limit));
        res.json(telemetryData);
    } catch (error) {
        console.error("Error fetching latest telemetry:", error);
        res.status(500).json({
            message: "Failed to fetch telemetry data",
            error: error.message
        });
    }
});

module.exports = router;