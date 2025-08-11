const express = require("express");
const router = express.Router();
const AttackLog = require("../models/AttackLog");

// GET all attack logs
router.get("/", async (req, res, next) => {
    try {
        const logs = await AttackLog.getAll();
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

// GET single attack log by ID
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await AttackLog.getById(id);
        if (!log) {
            return res.status(404).json({ message: "Attack log not found" });
        }
        res.json(log);
    } catch (error) {
        next(error);
    }
});

// POST new attack log
router.post("/", async (req, res, next) => {
    try {
        const newLog = await AttackLog.create(req.body);
        res.status(201).json({ success: true, message: "Attack log created successfully", log: newLog });
    } catch (error) {
        next(error);
    }
});

// PUT update attack log
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await AttackLog.update(id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Attack log not found" });
        }
        res.json({ success: true, message: "Attack log updated successfully" });
    } catch (error) {
        next(error);
    }
});

// DELETE attack log
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await AttackLog.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Attack log not found" });
        }
        res.json({ success: true, message: "Attack log deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// GET logs by simulation ID
router.get("/simulation/:simulationId", async (req, res, next) => {
    try {
        const { simulationId } = req.params;
        const logs = await AttackLog.getLogsBySimulationId(simulationId);
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

// GET logs by agent ID
router.get("/agent/:agentId", async (req, res, next) => {
    try {
        const { agentId } = req.params;
        const logs = await AttackLog.getLogsByAgentId(agentId);
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;