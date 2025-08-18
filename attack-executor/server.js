// attack-executor/server.js
require("dotenv").config();
const app = require("./src/app");
const { attackWorker, attackQueue } = require("./src/jobs/attackExecutionJob");

const PORT = process.env.ATTACK_EXECUTOR_PORT || 5001;

// Start HTTP server for receiving execution requests
const server = app.listen(PORT, () => {
    console.log(`Attack Executor HTTP server running on port ${PORT}`);
    console.log(`Ready to receive execution requests at http://localhost:${PORT}/execute`);
});

console.log("Attack Executor worker started and waiting for jobs...");

// Graceful shutdown
const shutdown = async () => {
    console.log("Attack Executor shutdown initiated...");
    try {
        // Close HTTP server first
        server.close(() => {
            console.log("HTTP server closed");
        });

        if (attackWorker) {
            console.log("Closing attack worker...");
            await attackWorker.close();
        }
        if (attackQueue) {
            console.log("Closing attack queue...");
            await attackQueue.close();
        }
    } catch (err) {
        console.error("Error closing worker/queue:", err);
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
