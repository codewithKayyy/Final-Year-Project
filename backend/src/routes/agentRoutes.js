const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");
const { sendCommandToAgent, getConnectedAgents } = require("../services/agentService");

// GET all agents
router.get("/", async (req, res, next) => {
    try {
        const agents = await Agent.getAll();
        res.json(agents);
    } catch (error) {
        next(error);
    }
});

// GET single agent by ID
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const agent = await Agent.getById(id);
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json(agent);
    } catch (error) {
        next(error);
    }
});

// POST new agent
router.post("/", async (req, res, next) => {
    try {
        const newAgent = await Agent.create(req.body);
        res.status(201).json({ success: true, message: "Agent created successfully", agent: newAgent });
    } catch (error) {
        next(error);
    }
});

// PUT update agent
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Agent.update(id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json({ success: true, message: "Agent updated successfully" });
    } catch (error) {
        next(error);
    }
});

// DELETE agent
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Agent.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.json({ success: true, message: "Agent deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// Endpoint for attack execution service to send commands to agents
router.post("/command", (req, res) => {
    const { agentId, commandType, payload } = req.body;
    if (!agentId || !commandType) {
        return res.status(400).json({ message: "agentId and commandType are required." });
    }

    const sent = sendCommandToAgent(agentId, commandType, payload);
    if (sent) {
        res.json({ success: true, message: `Command '${commandType}' sent to agent ${agentId}` });
    } else {
        res.status(404).json({ success: false, message: `Agent ${agentId} not connected.` });
    }
});

// Endpoint to get list of currently connected agents (for dashboard or internal use)
router.get("/connected", (req, res) => {
    const agents = getConnectedAgents();
    res.json({ connectedAgents: agents });
});

module.exports = router;