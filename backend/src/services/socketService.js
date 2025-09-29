// backend/src/services/socketService.js
const { Server } = require("socket.io");

let io;

/**
 * Initialize a single Socket.IO instance
 * @param {http.Server} server - The HTTP server instance
 */
function initSocket(server) {
    if (io) {
<<<<<<< HEAD
        console.warn("Socket.IO already initialized. Returning existing instance.");
=======
        console.warn("⚠️ Socket.IO already initialized. Returning existing instance.");
>>>>>>> origin/main
        return io;
    }

    io = new Server(server, {
        cors: {
            origin: "*", // ⚠️ Replace with frontend URL in production
            methods: ["GET", "POST"]
        }
    });

<<<<<<< HEAD
    console.log("Socket.IO initialized");
=======
    console.log("✅ Socket.IO initialized");
>>>>>>> origin/main
    return io;
}

function getIo() {
    if (!io) {
<<<<<<< HEAD
        throw new Error("Socket.IO not initialized. Call initSocket(server) first.");
=======
        throw new Error("❌ Socket.IO not initialized. Call initSocket(server) first.");
>>>>>>> origin/main
    }
    return io;
}

module.exports = { initSocket, getIo };
