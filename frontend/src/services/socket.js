// frontend/src/socket.js
import { io } from "socket.io-client";

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
