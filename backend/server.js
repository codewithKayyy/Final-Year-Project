// backend/server.js
require("dotenv").config();
const app = require("./src/app");
const { initSocket } = require("./src/services/socketService");
const { attachSocketEvents } = require("./src/services/socketEvents");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});

// Initialize socket
const io = initSocket(server);
attachSocketEvents(io);
