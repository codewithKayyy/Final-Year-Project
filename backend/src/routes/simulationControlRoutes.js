// backend/src/routes/simulationControlRoutes.js
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const { triggerAttackExecution } = require("../services/attackService");
const { validateSimulationStartData } = require("../utils/validators");

// POST start simulation and trigger attack execution (with campaign_id support)
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
            attackJobId: attackJobResult.jobId
        });

    } catch (error) {
        console.error("Error starting simulation:", error);
        next(error);
    }
});

module.exports = router;