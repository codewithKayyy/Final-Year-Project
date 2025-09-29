// backend/src/routes/simulationRoutes.js
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const AttackLog = require("../models/AttackLog");
const { validateSimulationData, validateAttackLogData } = require("../utils/validators");
const { notifySimulationUpdate } = require("../services/simulationService");

// ----------------- CRUD ROUTES (ENHANCED WITH CAMPAIGN SUPPORT) -----------------

// GET all simulations (with campaign info and optional filtering)
router.get("/", async (req, res, next) => {
    try {
        const { campaign } = req.query;

        let simulations;
        if (campaign) {
            simulations = await Simulation.getByCampaignId(campaign);
        } else {
            simulations = await Simulation.getAll();
        }

        res.json(simulations);
    } catch (error) {
        next(error);
    }
});

// GET single simulation by ID (with campaign info)
router.get("/:id", async (req, res, next) => {
    try {
        const simulation = await Simulation.getById(req.params.id);
        if (!simulation) {
            return res.status(404).json({ message: "Simulation not found" });
        }
        res.json(simulation);
    } catch (error) {
        next(error);
    }
});

// GET simulations by campaign ID (NEW)
router.get("/campaign/:campaignId", async (req, res, next) => {
    try {
        const simulations = await Simulation.getByCampaignId(req.params.campaignId);
        res.json(simulations);
    } catch (error) {
        next(error);
    }
});

// POST new simulation (with campaign_id support)
router.post("/", async (req, res, next) => {
    try {
        validateSimulationData(req.body);
        const newSimulation = await Simulation.create(req.body);
        res.status(201).json({
            success: true,
            message: "Simulation created successfully",
            simulation: newSimulation
        });
    } catch (error) {
        next(error);
    }
});

// PUT update simulation (with campaign_id support)
router.put("/:id", async (req, res, next) => {
    try {
        validateSimulationData(req.body, true);
        const result = await Simulation.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Simulation not found" });
        }
        res.json({ success: true, message: "Simulation updated successfully" });
    } catch (error) {
        next(error);
    }
});

// DELETE simulation
router.delete("/:id", async (req, res, next) => {
    try {
        const result = await Simulation.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Simulation not found" });
        }
        res.json({ success: true, message: "Simulation deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// GET campaign statistics (NEW)
router.get("/:campaignId/stats", async (req, res, next) => {
    try {
        const stats = await Simulation.getCampaignStats(req.params.campaignId);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

// ----------------- WEBHOOK ROUTE (KEEP EXISTING) -----------------
router.post("/update-attack-log", async (req, res, next) => {
    try {
        validateAttackLogData(req.body);
        const { simulationId, agentId, scriptId, status, stdout, stderr, error } = req.body;

        await AttackLog.updateLog({ simulationId, agentId, scriptId, status, stdout, stderr, error });

        if (status === "completed" || status === "failed") {
            await Simulation.update(simulationId, { status });
        }

        notifySimulationUpdate(simulationId, { status, agentId, scriptId, stdout, stderr, error });
        res.status(200).json({ message: "Attack log updated successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;