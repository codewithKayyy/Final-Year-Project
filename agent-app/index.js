#!/usr/bin/env node
// agent-app/index.js
require("dotenv").config();
const io = require("socket.io-client");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Configuration
const AGENT_ID = process.env.AGENT_ID || generateAgentId();
const BACKEND_WS_URL = process.env.BACKEND_WS_URL || "http://localhost:3001";
const TELEMETRY_INTERVAL = parseInt(process.env.TELEMETRY_INTERVAL) || 30000;
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 50;

let socket;
let reconnectAttempts = 0;
let heartbeatInterval;

// Generate unique agent ID based on machine characteristics
function generateAgentId() {
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const networkInterfaces = os.networkInterfaces();

    // Get primary MAC address
    let macAddress = 'unknown';
    for (const interfaceName in networkInterfaces) {
        const iface = networkInterfaces[interfaceName];
        const nonInternal = iface.find(alias => !alias.internal && alias.mac !== '00:00:00:00:00:00');
        if (nonInternal) {
            macAddress = nonInternal.mac;
            break;
        }
    }

    return `agent_${hostname}_${platform}_${macAddress.replace(/:/g, '')}`;
}

// Get system telemetry
function getSystemTelemetry() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const loadAverage = os.loadavg();

    return {
        agentId: AGENT_ID,
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        uptime: os.uptime(),
        timestamp: new Date().toISOString(),

        // System metrics
        cpuCount: cpus.length,
        cpuModel: cpus[0]?.model || 'unknown',
        loadAverage: loadAverage[0], // 1-minute load average
        totalMemoryMB: Math.round(totalMemory / 1024 / 1024),
        freeMemoryMB: Math.round(freeMemory / 1024 / 1024),
        memoryUsagePercent: Math.round(((totalMemory - freeMemory) / totalMemory) * 100),

        status: "active"
    };
}

// Initialize WebSocket connection
function initializeConnection() {
    console.log(`🔄 Attempting to connect to ${BACKEND_WS_URL} as agent ${AGENT_ID}`);

    socket = io(BACKEND_WS_URL, {
        timeout: 10000,
        reconnection: false // We'll handle reconnection manually
    });

    // Connection successful
    socket.on("connect", () => {
        console.log(`✅ Agent ${AGENT_ID} connected to backend WebSocket`);
        reconnectAttempts = 0;

        // Register agent with system information
        const registrationData = {
            agentId: AGENT_ID,
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            ipAddress: getLocalIPAddress(),
            macAddress: getPrimaryMacAddress(),
            osVersion: os.release(),
            nodeVersion: process.version
        };

        socket.emit("registerAgent", registrationData);

        // Start heartbeat
        startHeartbeat();
    });

    // Listen for commands from backend
    socket.on("command", handleCommand);

    // Handle simulation commands specifically
    socket.on("executeSimulation", handleSimulationExecution);

    // Connection lost
    socket.on("disconnect", (reason) => {
        console.log(`❌ Agent ${AGENT_ID} disconnected: ${reason}`);
        stopHeartbeat();

        // Attempt to reconnect unless it was intentional
        if (reason !== "io client disconnect") {
            scheduleReconnect();
        }
    });

    // Connection errors
    socket.on("connect_error", (error) => {
        console.error(`⚠️ Connection error:`, error.message);
        scheduleReconnect();
    });

    socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error);
    });
}

// Get local IP address
function getLocalIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const iface = networkInterfaces[interfaceName];
        const nonInternal = iface.find(alias => !alias.internal && alias.family === 'IPv4');
        if (nonInternal) {
            return nonInternal.address;
        }
    }
    return 'unknown';
}

// Get primary MAC address
function getPrimaryMacAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const iface = networkInterfaces[interfaceName];
        const nonInternal = iface.find(alias => !alias.internal && alias.mac !== '00:00:00:00:00:00');
        if (nonInternal) {
            return nonInternal.mac;
        }
    }
    return 'unknown';
}

// Handle commands from backend
function handleCommand(data) {
    console.log(`📥 Received command: ${data.type}`, data.payload || '');

    switch (data.type) {
        case 'ping':
            socket.emit('pong', { agentId: AGENT_ID, timestamp: new Date().toISOString() });
            break;

        case 'shutdown':
            console.log('🛑 Shutdown command received');
            gracefulShutdown();
            break;

        case 'restart':
            console.log('🔄 Restart command received');
            process.exit(0); // Let process manager restart
            break;

        case 'updateTelemetry':
            socket.emit('telemetry', getSystemTelemetry());
            break;

        default:
            console.log(`❓ Unknown command type: ${data.type}`);
    }
}

// Handle simulation execution commands
function handleSimulationExecution(data) {
    const { simulationId, agentId, scriptId, params } = data;
    console.log(`🎯 Executing simulation ${simulationId} with script ${scriptId}`);

    // Simulate attack execution (in real implementation, this would execute actual scripts)
    setTimeout(() => {
        const result = {
            simulationId,
            agentId: AGENT_ID,
            scriptId,
            status: 'completed',
            timestamp: new Date().toISOString(),
            outcome: 'success',
            details: {
                message: 'Simulation executed successfully',
                executionTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
                params: params
            }
        };

        socket.emit('simulationResult', result);
        console.log(`✅ Simulation ${simulationId} completed`);
    }, Math.floor(Math.random() * 3000) + 500); // Random delay 0.5-3.5 seconds
}

// Start heartbeat telemetry
function startHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);

    heartbeatInterval = setInterval(() => {
        if (socket && socket.connected) {
            socket.emit("telemetry", getSystemTelemetry());
        }
    }, TELEMETRY_INTERVAL);
}

// Stop heartbeat
function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

// Schedule reconnection attempt
function scheduleReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error(`❌ Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Exiting.`);
        process.exit(1);
    }

    reconnectAttempts++;
    const delay = Math.min(RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts - 1), 60000); // Exponential backoff, max 1 minute

    console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

    setTimeout(() => {
        if (socket) {
            socket.removeAllListeners();
            socket.close();
        }
        initializeConnection();
    }, delay);
}

// Graceful shutdown
function gracefulShutdown() {
    console.log('🛑 Shutting down agent...');

    stopHeartbeat();

    if (socket) {
        socket.emit('agentShutdown', { agentId: AGENT_ID, timestamp: new Date().toISOString() });
        socket.close();
    }

    process.exit(0);
}

// Handle process signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the agent
console.log(`🚀 Security Simulation Agent v1.0.0 starting...`);
console.log(`📍 Platform: ${os.platform()} ${os.arch()}`);
console.log(`🏷️  Agent ID: ${AGENT_ID}`);
console.log(`🌐 Backend URL: ${BACKEND_WS_URL}`);

// Save agent ID to file for persistence
const agentIdFile = path.join(__dirname, 'agent-id.txt');
fs.writeFileSync(agentIdFile, AGENT_ID);

initializeConnection();
