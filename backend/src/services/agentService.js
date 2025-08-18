// backend/src/services/agentService.js
const { getIo } = require("./socketService");
const Telemetry = require("../models/Telemetry");
const AttackLog = require("../models/AttackLog");

const connectedAgents = new Map();   // agentId -> { socketId, telemetry }
const socketToAgentMap = new Map();  // socketId -> agentId

function registerAgent(socket, agentId) {
    const io = getIo();

    // Handle duplicate connections
    if (connectedAgents.has(agentId)) {
        console.warn(`⚠️ Agent ${agentId} already connected. Disconnecting old socket.`);
        const oldSocketId = connectedAgents.get(agentId).socketId;
        io.sockets.sockets.get(oldSocketId)?.disconnect();
    }

    connectedAgents.set(agentId, { socketId: socket.id, telemetry: {} });
    socketToAgentMap.set(socket.id, agentId);

    console.log(`✅ Agent ${agentId} registered with socket ${socket.id}`);
    io.emit("agentStatusUpdate", { agentId, status: "online" });
}

function unregisterAgent(socketId) {
    const io = getIo();
    const agentId = socketToAgentMap.get(socketId);

    if (agentId) {
        connectedAgents.delete(agentId);
        socketToAgentMap.delete(socketId);

        console.log(`❌ Agent ${agentId} disconnected (socket ID: ${socketId})`);
        io.emit("agentStatusUpdate", { agentId, status: "offline" });
    } else {
        console.log(`❌ Unknown socket ${socketId} disconnected`);
    }
}

function sendCommandToAgent(agentId, commandType, payload) {
    const io = getIo();
    const agentInfo = connectedAgents.get(agentId);

    if (!agentInfo) {
        console.warn(`⚠️ Agent ${agentId} not connected. Command '${commandType}' not sent.`);
        return false;
    }

    io.to(agentInfo.socketId).emit("command", { type: commandType, payload });
    console.log(`📢 Command '${commandType}' sent to agent ${agentId}`);
    return true;
}

async function handleTelemetry(socket, data) {
    const agentId = socketToAgentMap.get(socket.id);
    console.log(`📡 Telemetry from ${agentId || socket.id}:`, data);

    if (agentId) {
        try {
            connectedAgents.get(agentId).telemetry = data; // store in memory
            await Telemetry.save(agentId, data); // persist to DB
        } catch (err) {
            console.error("❌ Failed to save telemetry:", err.message);
        }
    }
}

async function handleAttackOutcome(socket, data) {
    const agentId = socketToAgentMap.get(socket.id);
    console.log(`🎯 Attack outcome from ${agentId || socket.id}:`, data);

    if (agentId) {
        try {
            await AttackLog.updateLog({
                simulationId: data.simulationId,
                agentId,
                scriptId: data.scriptId,
                status: data.outcome,
                stdout: data.details,
                stderr: null,
                error: data.error || null
            });
        } catch (err) {
            console.error("❌ Failed to update attack log:", err.message);
        }
    }
}

function getConnectedAgents() {
    return Array.from(connectedAgents.entries()).map(([agentId, info]) => ({
        agentId,
        telemetry: info.telemetry
    }));
}

module.exports = {
    registerAgent,
    unregisterAgent,
    sendCommandToAgent,
    handleTelemetry,
    handleAttackOutcome,
    getConnectedAgents
};
