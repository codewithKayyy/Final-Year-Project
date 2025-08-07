<<<<<<< HEAD
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
=======
require('dotenv').config();
console.log('MYSQL PASSWORD:', process.env.DB_PASSWORD);
const express = require('express');
const cors = require('cors');
const campaignRoutes = require('./routes/campaignRoutes');
const staffRoutes = require('./routes/staffRoutes');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db'); // bring in DB object

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use('/api/campaigns', campaignRoutes);
app.use('/api/staff', (req, res, next) => {
    req.db = db; // attach DB connection to req
    next();
}, staffRoutes);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('activity', (data) => {
        io.emit('activityUpdate', data);
    });
});

require('./config/db');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 129805f879708b46ec045bc1640945e042508fe0
