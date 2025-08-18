// backend/src/services/socketEvents.js
const {
    registerAgent,
    unregisterAgent,
    handleTelemetry,
    handleAttackOutcome
} = require("./agentService");
const {
    notifySimulationUpdate,
    notifyAgentStatus
} = require("./simulationService");

/**
 * Attach all event handlers for new socket connections.
 */
function attachSocketEvents(io) {
    io.on("connection", (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        // ─── 1. Agent Registration ───────────────────────────────
        socket.on("registerAgent", (agentId) => {
            registerAgent(socket, agentId);
            notifyAgentStatus(agentId, "online"); // 🔔 Notify dashboards
        });

        // ─── 2. Telemetry Data ──────────────────────────────────
        socket.on("telemetry", async (data) => {
            await handleTelemetry(socket, data);
            if (data.agentId) {
                io.emit("agentTelemetryUpdate", { agentId: data.agentId, ...data });
            }
        });

        // ─── 3. Attack Outcome ──────────────────────────────────
        socket.on("attackOutcome", async (data) => {
            await handleAttackOutcome(socket, data);
            notifySimulationUpdate(data.simulationId, {
                status: data.outcome,
                agentId: data.agentId,
                details: data.details
            });
        });

        // ─── 4. Disconnect ──────────────────────────────────────
        socket.on("disconnect", () => {
            unregisterAgent(socket.id);
            const agentId = socket.handshake.query?.agentId;
            if (agentId) notifyAgentStatus(agentId, "offline");
        });

        // ─── 5. Error Handler ───────────────────────────────────
        socket.on("error", (err) => {
            console.error(`⚠️ Socket error [${socket.id}]:`, err.message);
        });
    });
}

module.exports = { attachSocketEvents };
