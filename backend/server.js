// backend/server.js
require("dotenv").config();
const app = require("./src/app");
const http = require("http"); // Import http module
const { initializeSocketIO } = require("./src/services/agentService");

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app); // Create HTTP server from Express app
initializeSocketIO(httpServer); // Initialize Socket.IO with the HTTP server

httpServer.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});