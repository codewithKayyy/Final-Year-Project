// backend/src/socketHandlers/agentSocket.js
const { registerAgent, unregisterAgent, getConnectedAgents } = require("../services/agentService");
const { notifyAgentStatus } = require("../services/simulationService");
const AttackLog = require("../models/AttackLog");

function handleAgentSocket(socket) {
    // Agent registration
    socket.on("registerAgent", (agentId) => {
        if (!agentId) {
<<<<<<< HEAD
            console.warn("Agent tried to register without agentId");
=======
            console.warn("⚠️ Agent tried to register without agentId");
>>>>>>> origin/main
            return;
        }
        registerAgent(socket, agentId);
        notifyAgentStatus(agentId, "connected");
    });

    // Attack outcome (persist results to DB)
    socket.on("attackOutcome", async (data) => {
<<<<<<< HEAD
        console.log(`Attack outcome from agent ${data.agentId}:`, data);
=======
        console.log(`📥 Attack outcome from agent ${data.agentId}:`, data);
>>>>>>> origin/main

        try {
            await AttackLog.updateLog({
                simulationId: data.simulationId,
                agentId: data.agentId,
                scriptId: data.scriptId || null,
                status: data.outcome === "success" ? "completed" : "failed",
                stdout: data.details || null,
                stderr: null,
                error: data.outcome === "failed" ? data.details : null,
            });

            notifyAgentStatus(data.agentId, `attack ${data.outcome}`);
        } catch (err) {
<<<<<<< HEAD
            console.error("Failed to save attack outcome:", err.message);
=======
            console.error("❌ Failed to save attack outcome:", err.message);
>>>>>>> origin/main
        }
    });

    // Telemetry
    socket.on("telemetry", (telemetry) => {
<<<<<<< HEAD
        console.log(`Telemetry from agent:`, telemetry);
=======
        console.log(`📡 Telemetry from agent:`, telemetry);
>>>>>>> origin/main
        // Future: Save telemetry to DB
    });

    // On disconnect
    socket.on("disconnect", () => {
        const agentId = Object.keys(getConnectedAgents())
            .find((id) => getConnectedAgents()[id] === socket.id);
        if (agentId) {
            unregisterAgent(agentId);
            notifyAgentStatus(agentId, "disconnected");
        }
    });
}

module.exports = { handleAgentSocket };
