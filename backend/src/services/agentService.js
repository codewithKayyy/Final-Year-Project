const { Server } = require("socket.io");

let io;
const connectedAgents = new Map(); // Map to store agentId -> socketId
const socketToAgentMap = new Map(); // Map to store socketId -> agentId

const initializeSocketIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // Adjust for production: your frontend domain, or specific agent origins
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Agent connected: ${socket.id}`);

        // Agent registration (e.g., agent sends its unique ID)
        socket.on("registerAgent", (agentId) => {
            if (connectedAgents.has(agentId)) {
                console.warn(`Agent ${agentId} already connected. Disconnecting old socket.`);
                // Optionally disconnect old socket if a new one connects with same ID
                const oldSocketId = connectedAgents.get(agentId);
                io.sockets.sockets.get(oldSocketId)?.disconnect();
            }
            connectedAgents.set(agentId, socket.id);
            socketToAgentMap.set(socket.id, agentId);
            console.log(`Agent ${agentId} registered with socket ID ${socket.id}`);
            // Emit status update to dashboard or log
            io.emit("agentStatusUpdate", { agentId, status: "online" });
        });

        // Handle telemetry data from agents
        socket.on("telemetry", (data) => {
            const agentId = socketToAgentMap.get(socket.id);
            console.log(`Telemetry from ${agentId || socket.id}:`, data);
            // TODO: Process and store telemetry data in database
            // Example: Save to a 'telemetry_logs' table
            // TelemetryModel.save(agentId, data);
        });

        // Handle agent reporting attack outcomes
        socket.on("attackOutcome", (data) => {
            const agentId = socketToAgentMap.get(socket.id);
            console.log(`Attack outcome from ${agentId || socket.id}:`, data);
            // TODO: Update simulation/attack_logs in database
            // AttackLogModel.updateOutcome(data.simulationId, agentId, data.outcome);
        });

        socket.on("disconnect", () => {
            const agentId = socketToAgentMap.get(socket.id);
            if (agentId) {
                connectedAgents.delete(agentId);
                socketToAgentMap.delete(socket.id);
                console.log(`Agent ${agentId} disconnected (socket ID: ${socket.id})`);
                io.emit("agentStatusUpdate", { agentId, status: "offline" });
            } else {
                console.log(`Agent disconnected (socket ID: ${socket.id})`);
            }
        });

        socket.on("error", (err) => {
            console.error(`Socket error for ${socket.id}:`, err);
        });
    });

    console.log("Socket.IO server initialized.");
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};

const sendCommandToAgent = (agentId, commandType, payload) => {
    const socketId = connectedAgents.get(agentId);
    if (socketId) {
        io.to(socketId).emit("command", { type: commandType, payload });
        console.log(`Command '${commandType}' sent to agent ${agentId}`);
        return true;
    } else {
        console.warn(`Agent ${agentId} not connected. Command '${commandType}' not sent.`);
        return false;
    }
};

const getConnectedAgents = () => {
    return Array.from(connectedAgents.keys());
};

module.exports = {
    initializeSocketIO,
    getIo,
    sendCommandToAgent,
    getConnectedAgents
};