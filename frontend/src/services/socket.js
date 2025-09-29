// frontend/src/socket.js
import { io } from "socket.io-client";

<<<<<<< HEAD
const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const socket = io(BACKEND_WS_URL, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

socket.on("connect", () => {
    console.log("Connected to backend WebSocket:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected from backend WebSocket:", reason);
});

socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err.message);
});

// Listen for agent status updates
socket.on("agentStatusUpdate", (data) => {
    console.log("Agent status updated:", data);
});

// Listen for simulation completion (optional)
socket.on("simulationCompleted", (data) => {
    console.log("Simulation completed:", data);
});
=======
// Must match backend URL in .env
// In your frontend .env file:
// VITE_BACKEND_URL=http://localhost:3001
const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const socket = io(BACKEND_WS_URL, {
    transports: ["websocket", "polling"], // allow fallback for compatibility
    reconnectionAttempts: 5,              // try reconnecting up to 5 times
    reconnectionDelay: 2000,              // wait 2s before retry
    // auth: { token: localStorage.getItem("jwtToken") } // add if you secure sockets
});

// Connection lifecycle logs
socket.on("connect", () => {
    console.log("✅ Connected to backend WebSocket:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from backend WebSocket:", reason);
});

socket.on("connect_error", (err) => {
    console.error("⚠️ WebSocket connection error:", err.message);
});

// Example: register dashboard client
// socket.emit("registerDashboard", { dashboardId: "your-dashboard-id" });
>>>>>>> origin/main
