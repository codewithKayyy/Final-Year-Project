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
        socket.on("registerAgent", async (registrationData) => {
            // Handle both old format (string) and new format (object)
            const agentData = typeof registrationData === 'string'
                ? { agentId: registrationData }
                : registrationData;

            await registerAgent(socket, agentData);
            notifyAgentStatus(agentData.agentId, "online"); // 🔔 Notify dashboards
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

        // ─── 4. Simulation Result (New Format) ─────────────────
        socket.on("simulationResult", async (data) => {
            console.log(`📊 Simulation result from ${data.agentId}:`, data);
            await handleAttackOutcome(socket, {
                simulationId: data.simulationId,
                agentId: data.agentId,
                outcome: data.status,
                details: data.details
            });
            notifySimulationUpdate(data.simulationId, {
                status: data.status,
                agentId: data.agentId,
                details: data.details
            });
        });

        // ─── 5. Agent Control Events ─────────────────────────────
        socket.on("pong", (data) => {
            console.log(`🏓 Pong from ${data.agentId} at ${data.timestamp}`);
        });

        socket.on("agentShutdown", (data) => {
            console.log(`🛑 Agent ${data.agentId} shutting down at ${data.timestamp}`);
            unregisterAgent(socket.id);
            notifyAgentStatus(data.agentId, "offline");
        });

        // ─── 6. Disconnect ──────────────────────────────────────
        socket.on("disconnect", () => {
            unregisterAgent(socket.id);
            const agentId = socket.handshake.query?.agentId;
            if (agentId) notifyAgentStatus(agentId, "offline");
        });

        // ─── 7. Error Handler ───────────────────────────────────
        socket.on("error", (err) => {
            console.error(`⚠️ Socket error [${socket.id}]:`, err.message);
        });
    });
}

module.exports = { attachSocketEvents };
