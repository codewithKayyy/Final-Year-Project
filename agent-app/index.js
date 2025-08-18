// agent-app/index.js
require("dotenv").config(); // <-- load .env first
const io = require("socket.io-client");

const AGENT_ID = process.env.AGENT_ID || "agent_12345";
const BACKEND_WS_URL = process.env.BACKEND_WS_URL || "http://localhost:3001";
const TELEMETRY_INTERVAL = process.env.TELEMETRY_INTERVAL || 30000;

const socket = io(BACKEND_WS_URL);

// Register agent on connect
socket.on("connect", () => {
    console.log(`✅ Agent ${AGENT_ID} connected to backend WebSocket`);
    socket.emit("registerAgent", AGENT_ID);
});

// Listen for commands
socket.on("command", (data) => {
    console.log(`📥 Received command: ${data.type}`, data.payload);

    // TODO: implement actual attack simulation
    if (data.type === "execute_phishing_action") {
        console.log("Simulating phishing action...");

        // Report back result
        socket.emit("attackOutcome", {
            simulationId: data.payload.simulationId,
            agentId: AGENT_ID,
            outcome: "success",
            details: "Phishing simulated successfully"
        });
    }
});

// Telemetry heartbeat
setInterval(() => {
    socket.emit("telemetry", {
        agentId: AGENT_ID,
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        status: "active"
    });
}, TELEMETRY_INTERVAL);

socket.on("disconnect", () => {
    console.log(`❌ Agent ${AGENT_ID} disconnected from backend`);
});

socket.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err);
});
