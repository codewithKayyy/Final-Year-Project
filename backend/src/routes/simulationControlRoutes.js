const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const AttackLog = require("../models/AttackLog");
const { triggerAttackExecution } = require("../services/attackService");
const { validateSimulationStartData, validateAttackLogData } = require("../utils/validators");
const { notifySimulationUpdate } = require("../services/simulationService"); // optional WebSocket updates

// POST start simulation and trigger attack execution
router.post("/start", async (req, res, next) => {
    try {
        validateSimulationStartData(req.body);

        const { name, targetStaffId, attackScriptId, attackParams } = req.body;

        // Create simulation record in DB
        const newSimulation = await Simulation.create({
            name,
            targetStaffId,
            status: "pending"
        });

        // Trigger the attack executor service
        const attackJobResult = await triggerAttackExecution(
            attackScriptId,
            attackParams,
            newSimulation.id,
            targetStaffId
        );

        res.status(200).json({
            message: "Simulation initiated successfully",
            simulationId: newSimulation.id,
            attackJobId: attackJobResult.jobId
        });

    } catch (error) {
        next(error);
    }
});

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
