// backend/src/routes/agentRoutes.js
const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent"); // persistent DB model
const { sendCommandToAgent, getConnectedAgents } = require("../services/agentService");

//
// ─── CRUD Endpoints (Database agents) ─────────────────────────────────────────
//

// GET all agents (DB)
router.get("/", async (req, res, next) => {
    try {
        const agents = await Agent.getAll();
        res.json(agents);
    } catch (error) {
        next(error);
    }
});

// GET single agent by ID (DB)
router.get("/:id", async (req, res, next) => {
    try {
        const agent = await Agent.getById(req.params.id);
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json(agent);
    } catch (error) {
        next(error);
    }
});

// POST new agent (DB)
router.post("/", async (req, res, next) => {
    try {
        const newAgent = await Agent.create(req.body);
        res.status(201).json({ success: true, message: "Agent created successfully", agent: newAgent });
    } catch (error) {
        next(error);
    }
});

// PUT update agent (DB)
router.put("/:id", async (req, res, next) => {
    try {
        const result = await Agent.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json({ success: true, message: "Agent updated successfully" });
    } catch (error) {
        next(error);
    }
});

// DELETE agent (DB)
router.delete("/:id", async (req, res, next) => {
    try {
        const result = await Agent.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json({ success: true, message: "Agent deleted successfully" });
    } catch (error) {
        next(error);
    }
});

//
// ─── Real-time Agent Endpoints (WebSockets) ──────────────────────────────────
//

// POST /api/agents/command → send command to a connected agent
router.post("/command", (req, res) => {
    const { agentId, commandType, payload } = req.body;
    if (!agentId || !commandType) {
        return res.status(400).json({ message: "agentId and commandType are required." });
    }

    const sent = sendCommandToAgent(agentId, commandType, payload || {});
    if (sent) {
        res.json({ success: true, message: `Command '${commandType}' sent to agent ${agentId}` });
    } else {
        res.status(404).json({ success: false, message: `Agent ${agentId} not connected.` });
    }
});

// GET /api/agents/connected → list connected agents with telemetry
router.get("/connected/list", (req, res) => {
    const agents = getConnectedAgents();
    res.json({ connectedAgents: agents });
});

module.exports = router;
