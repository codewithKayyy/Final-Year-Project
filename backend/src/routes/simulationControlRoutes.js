// backend/src/routes/simulationControlRoutes.js
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const AttackLog = require("../models/AttackLog");
const { triggerAttackExecution } = require("../services/attackService");
const { validateSimulationStartData, validateAttackLogData } = require("../utils/validators");
const { notifySimulationUpdate } = require("../services/simulationService"); // optional WebSocket updates

/**
 * POST /api/simulation/start
 * Start a simulation and trigger attack execution
 */
router.post("/start", async (req, res, next) => {
    try {
        validateSimulationStartData(req.body);

        const {
            name,
            targetStaffId,
            targetAgentId,
            attackScriptId,
            attackParams,
            campaign_id,
        } = req.body;

        // Normalize inputs
        const staffId = targetStaffId || null;
        const agentId = targetAgentId || null;
        const scriptId = attackScriptId || "default_phishing_script";
        const params = attackParams || {};

        // Create simulation record in DB with campaign support
        const simulationName =
            name || `Simulation ${new Date().toISOString().slice(0, 19).replace("T", " ")}`;

        const newSimulation = await Simulation.create({
            name: simulationName,
            description: null,
            scheduled_start: null,
            actual_start: null,
            status: "scheduled",
            created_by: 1, // TODO: replace with req.user.id when auth is enforced
            campaign_id: campaign_id || null,
            type: "phishing",
        });

        // Trigger the attack executor service
        const attackJobResult = await triggerAttackExecution(
            scriptId,
            params,
            newSimulation.id,
            staffId || agentId
        );

        res.status(200).json({
            message: "Simulation initiated successfully",
            simulationId: newSimulation.id,
            campaignId: campaign_id,
            attackJobId: attackJobResult.jobId,
        });
    } catch (error) {
        console.error("❌ Error starting simulation:", error);
        next(error);
    }
});

/**
 * POST /api/simulation/update-attack-log
 * Webhook endpoint for attack-executor to send back results.
 */
router.post("/update-attack-log", async (req, res, next) => {
    try {
        // Validate input
        validateAttackLogData(req.body);

        const { simulationId, agentId, scriptId, status, stdout, stderr, error } = req.body;

        // Update the attack log in the DB
        await AttackLog.updateLog({
            simulationId,
            agentId,
            scriptId,
            status,
            stdout,
            stderr,
            error,
        });

        // Update simulation status too
        if (status === "completed") {
            await Simulation.update(simulationId, { status: "completed" });
        } else if (status === "failed") {
            await Simulation.update(simulationId, { status: "failed" });
        }

        // Notify the dashboard in real time (if socket service enabled)
        notifySimulationUpdate(simulationId, { status, agentId });

        res.status(200).json({ message: "Attack log updated successfully" });
    } catch (err) {
        console.error("❌ Error updating attack log:", err);
        next(err);
    }
});

module.exports = router;
