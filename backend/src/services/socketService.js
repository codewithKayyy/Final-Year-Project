// backend/src/services/socketService.js
const { Server } = require("socket.io");

let io;

/**
 * Initialize a single Socket.IO instance
 * @param {http.Server} server - The HTTP server instance
 */
function initSocket(server) {
    if (io) {
        console.warn("⚠️ Socket.IO already initialized. Returning existing instance.");
        return io;
    }

    io = new Server(server, {
        cors: {
            origin: "*", // ⚠️ Replace with frontend URL in production
            methods: ["GET", "POST"]
        }
    });

    console.log("✅ Socket.IO initialized");
    return io;
}

function getIo() {
    if (!io) {
        throw new Error("❌ Socket.IO not initialized. Call initSocket(server) first.");
    }
    return io;
}

module.exports = { initSocket, getIo };
