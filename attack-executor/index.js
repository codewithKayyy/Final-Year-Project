// attack-executor/src/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { addAttackJob } = require("./jobs/attackExecutionJob");

const app = express();
app.use(bodyParser.json());

/**
 * POST /execute
 * Enqueue a new attack job into the BullMQ queue.
 */
app.post("/execute", async (req, res) => {
    try {
        const { scriptId, params, simulationId, agentId } = req.body;

        if (!scriptId || !simulationId) {
            return res.status(400).json({ error: "scriptId and simulationId are required" });
        }

        // Add job to queue
        const job = await addAttackJob(scriptId, params, simulationId, agentId);

        res.status(202).json({
            message: "Attack job enqueued successfully",
            jobId: job.id,
        });
    } catch (err) {
        console.error("❌ Failed to enqueue attack job:", err.message);
        res.status(500).json({ error: "Failed to enqueue attack job" });
    }
});

// Start HTTP server for executor
const PORT = process.env.EXECUTOR_PORT || 4000;
app.listen(PORT, () => {
    console.log(`⚡ Attack Executor running on port ${PORT}`);
});
