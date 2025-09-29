// backend/src/services/agentService.js
const { getIo } = require("./socketService");
const Agent = require("../models/Agent");
const Telemetry = require("../models/Telemetry");
const AttackLog = require("../models/AttackLog");

const connectedAgents = new Map();   // agentId -> { socketId, telemetry }
const socketToAgentMap = new Map();  // socketId -> agentId

async function registerAgent(socket, agentData) {
    const io = getIo();
    const agentId = agentData.agentId || agentData; // Handle both string and object format

    // Handle duplicate connections
    if (connectedAgents.has(agentId)) {
        console.warn(`Agent ${agentId} already connected. Disconnecting old socket.`);
        const oldSocketId = connectedAgents.get(agentId).socketId;
        io.sockets.sockets.get(oldSocketId)?.disconnect();
    }

    const agentInfo = {
        socketId: socket.id,
        telemetry: {},
        // Store additional agent information if provided
        ...(typeof agentData === 'object' && {
            hostname: agentData.hostname,
            platform: agentData.platform,
            arch: agentData.arch,
            ipAddress: agentData.ipAddress,
            macAddress: agentData.macAddress,
            osVersion: agentData.osVersion,
            nodeVersion: agentData.nodeVersion,
            registeredAt: new Date().toISOString()
        })
    };

    connectedAgents.set(agentId, agentInfo);
    socketToAgentMap.set(socket.id, agentId);

    // Persist agent to database (create or update)
    if (typeof agentData === 'object') {
        try {
            const existingAgent = await Agent.findByAgentId(agentId);

            if (existingAgent) {
                // Update existing agent's telemetry and set to active
                await Agent.updateTelemetry(agentId, {
                    ip_address: agentData.ipAddress,
                    mac_address: agentData.macAddress,
                    os_type: agentData.platform,
                    os_version: agentData.osVersion
                });
                console.log(`✅ Updated existing agent ${agentId} in database`);
            } else {
                // Create new agent
                await Agent.create({
                    agent_id: agentId,
                    agent_name: agentData.hostname || agentId,
                    ip_address: agentData.ipAddress,
                    mac_address: agentData.macAddress,
                    os_type: agentData.platform,
                    os_version: agentData.osVersion
                });
                console.log(`✅ Created new agent ${agentId} in database`);
            }
        } catch (error) {
            console.error(`❌ Failed to persist agent ${agentId} to database:`, error);
        }
    }

    console.log(`Agent ${agentId} registered with socket ${socket.id}`);
    if (typeof agentData === 'object') {
        console.log(`   Platform: ${agentData.platform} ${agentData.arch}`);
        console.log(`   Hostname: ${agentData.hostname}`);
        console.log(`   IP: ${agentData.ipAddress}`);
    }

    io.emit("agentStatusUpdate", { agentId, status: "online", ...agentInfo });
}

function unregisterAgent(socketId) {
    const io = getIo();
    const agentId = socketToAgentMap.get(socketId);

    if (agentId) {
        connectedAgents.delete(agentId);
        socketToAgentMap.delete(socketId);

        console.log(`Agent ${agentId} disconnected (socket ID: ${socketId})`);
        io.emit("agentStatusUpdate", { agentId, status: "offline" });
    } else {
        console.log(`Unknown socket ${socketId} disconnected`);
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

function sendSimulationToAgent(agentId, simulationData) {
    const io = getIo();
    const agentInfo = connectedAgents.get(agentId);

    if (!agentInfo) {
        console.warn(`⚠️ Agent ${agentId} not connected. Simulation not sent.`);
        return false;
    }

    io.to(agentInfo.socketId).emit("executeSimulation", simulationData);
    console.log(`🎯 Simulation ${simulationData.simulationId} sent to agent ${agentId}`);
    return true;
}

async function handleTelemetry(socket, data) {
    const agentId = socketToAgentMap.get(socket.id);

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
    sendSimulationToAgent,
    handleTelemetry,
    handleAttackOutcome,
    getConnectedAgents
};
