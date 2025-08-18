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

        const { name, targetStaffId, attackScriptId, attackParams, campaign_id } = req.body;

        // Create simulation record in DB with campaign_id
        const newSimulation = await Simulation.create({
            name,
            targetStaffId,
            campaign_id: campaign_id || null,
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
            campaignId: campaign_id,
            attackJobId: attackJobResult.jobId
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;