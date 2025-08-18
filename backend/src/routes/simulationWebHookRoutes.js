// backend/src/routes/simulationWebhookRoutes.js
const express = require("express");
const router = express.Router();
const AttackLog = require("../models/AttackLog");
const { notifySimulationUpdate } = require("../services/simulationService");

router.post("/update-attack-log", async (req, res, next) => {
    try {
        const {
            simulationId,
            agentId,
            scriptId,
            status,
            stdout,
            stderr,
            error
        } = req.body;

        // 1. Basic validation
        if (!simulationId || !agentId || !scriptId || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 2. Save/update the attack log in DB
        await AttackLog.updateLog({
            simulationId,
            agentId,
            scriptId,
            status,
            stdout,
            stderr,
            error
        });

        // 3. Optionally, update the simulation status and notify frontend
        notifySimulationUpdate(simulationId, { status, agentId });

        // 4. Respond to attack-executor
        res.status(200).json({ message: "Attack log updated successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
