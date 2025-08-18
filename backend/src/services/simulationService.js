// backend/src/services/simulationService.js
const { getIo } = require("./socketService");

/**
 * Notify all connected dashboards or specific rooms about simulation updates.
 */
const notifySimulationUpdate = (simulationId, updateData) => {
    const io = getIo();
    if (!io) return;

    io.to(simulationId.toString()).emit("simulationUpdate", {
        simulationId,
        ...updateData
    });

    console.log(`📡 Notified dashboards of simulation update for simulation ${simulationId}`, updateData);
};

/**
 * Notify all connected dashboards about an agent’s status update.
 */
const notifyAgentStatus = (agentId, status) => {
    const io = getIo();
    if (!io) return;

    io.emit("agentStatusUpdate", { agentId, status });
    console.log(`📡 Notified dashboards of agent ${agentId} status: ${status}`);
};

module.exports = {
    notifySimulationUpdate,
    notifyAgentStatus
};
