<<<<<<< HEAD
// backend/src/routes/simulationControlRoutes.js
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const { triggerAttackExecution } = require("../services/attackService");
const { validateSimulationStartData } = require("../utils/validators");

// POST start simulation and trigger attack execution (with campaign_id support)
=======
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const AttackLog = require("../models/AttackLog");
const { triggerAttackExecution } = require("../services/attackService");
const { validateSimulationStartData, validateAttackLogData } = require("../utils/validators");
const { notifySimulationUpdate } = require("../services/simulationService"); // optional WebSocket updates

// POST start simulation and trigger attack execution
>>>>>>> origin/main
router.post("/start", async (req, res, next) => {
    try {
        validateSimulationStartData(req.body);

<<<<<<< HEAD
        const {
            name,
            targetStaffId,
            targetAgentId,
            attackScriptId,
            attackParams,
            campaign_id,
            simulationId
        } = req.body;

        // Handle both targetStaffId and targetAgentId parameters
        const staffId = targetStaffId || null;
        const agentId = targetAgentId || null;
        const scriptId = attackScriptId || 'default_phishing_script';
        const params = attackParams || {};

        // Create simulation record in DB with campaign_id
        const simulationName = name || `Simulation ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`;
        const newSimulation = await Simulation.create({
            name: simulationName,
            description: null,
            scheduled_start: null,
            actual_start: null,
            status: "scheduled",
            created_by: 1,
            campaign_id: campaign_id || null,
            type: "phishing"
=======
        const { name, targetStaffId, attackScriptId, attackParams } = req.body;

        // Create simulation record in DB
        const newSimulation = await Simulation.create({
            name,
            targetStaffId,
            status: "pending"
>>>>>>> origin/main
        });

        // Trigger the attack executor service
        const attackJobResult = await triggerAttackExecution(
<<<<<<< HEAD
            scriptId,
            params,
            newSimulation.id,
            staffId || agentId
=======
            attackScriptId,
            attackParams,
            newSimulation.id,
            targetStaffId
>>>>>>> origin/main
        );

        res.status(200).json({
            message: "Simulation initiated successfully",
            simulationId: newSimulation.id,
<<<<<<< HEAD
            campaignId: campaign_id,
=======
>>>>>>> origin/main
            attackJobId: attackJobResult.jobId
        });

    } catch (error) {
<<<<<<< HEAD
        console.error("Error starting simulation:", error);
=======
>>>>>>> origin/main
        next(error);
    }
});

<<<<<<< HEAD
module.exports = router;
=======
/**
 * Webhook endpoint for attack-executor to send back results.
 * Called asynchronously once a job is completed/failed.
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
            error
        });

        // Optionally update simulation status too
        if (status === "completed") {
            await Simulation.update(simulationId, { status: "completed" });
        } else if (status === "failed") {
            await Simulation.update(simulationId, { status: "failed" });
        }

        // Optionally notify the dashboard in real time
        notifySimulationUpdate(simulationId, { status, agentId });

        res.status(200).json({ message: "Attack log updated successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
>>>>>>> origin/main
