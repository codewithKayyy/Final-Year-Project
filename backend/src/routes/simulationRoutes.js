const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");

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
        const { id } = req.params;
        const simulation = await Simulation.getById(id);
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
        const newSimulation = await Simulation.create(req.body);
        res.status(201).json({ success: true, message: "Simulation created successfully", simulation: newSimulation });
    } catch (error) {
        next(error);
    }
});

// PUT update simulation
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Simulation.update(id, req.body);
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
        const { id } = req.params;
        const result = await Simulation.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Simulation not found" });
        }
        res.json({ success: true, message: "Simulation deleted successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;