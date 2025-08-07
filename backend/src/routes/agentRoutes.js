const express = require("express");
const router = express.Router();
const { sendCommandToAgent, getConnectedAgents } = require("../services/agentService");

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