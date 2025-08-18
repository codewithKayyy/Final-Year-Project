// frontend/src/socket.js
import { io } from "socket.io-client";

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
