// backend/src/routes/simulationRoutes.js
const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const AttackLog = require("../models/AttackLog");
const { validateSimulationData, validateAttackLogData } = require("../utils/validators");
const { notifySimulationUpdate } = require("../services/simulationService");

// ----------------- CRUD ROUTES -----------------

// GET all simulations
router.get("/", async (req, res, next) => {
    try {
        const simulations = await Simulation.getAll();
        res.json(simulations);
    } catch (error) {
        next(error);
    }
});

// GET single simulation by ID
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

// POST new simulation
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

// PUT update simulation
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

// ----------------- WEBHOOK ROUTE -----------------
router.post("/update-attack-log", async (req, res, next) => {
    try {
        // 1. Validate incoming payload
        validateAttackLogData(req.body);

        const { simulationId, agentId, scriptId, status, stdout, stderr, error } = req.body;

        // 2. Save or update attack log
        await AttackLog.updateLog({
            simulationId,
            agentId,
            scriptId,
            status,
            stdout,
            stderr,
            error
        });

        // 3. Update simulation status if finished
        if (status === "completed" || status === "failed") {
            await Simulation.update(simulationId, { status });
        }

        // 4. Notify dashboards in real-time
        notifySimulationUpdate(simulationId, {
            status,
            agentId,
            scriptId,
            stdout,
            stderr,
            error
        });

        // 5. Respond to executor
        res.status(200).json({ message: "Attack log updated successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
