// backend/src/socketHandlers/agentSocket.js
const { registerAgent, unregisterAgent, getConnectedAgents } = require("../services/agentService");
const { notifyAgentStatus } = require("../services/simulationService");
const AttackLog = require("../models/AttackLog");

function handleAgentSocket(socket) {
    // Agent registration
    socket.on("registerAgent", (agentId) => {
        if (!agentId) {
            console.warn("⚠️ Agent tried to register without agentId");
            return;
        }
        registerAgent(socket, agentId);
        notifyAgentStatus(agentId, "connected");
    });

    // Attack outcome (persist results to DB)
    socket.on("attackOutcome", async (data) => {
        console.log(`📥 Attack outcome from agent ${data.agentId}:`, data);

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
            console.error("❌ Failed to save attack outcome:", err.message);
        }
    });

    // Telemetry
    socket.on("telemetry", (telemetry) => {
        console.log(`📡 Telemetry from agent:`, telemetry);
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
