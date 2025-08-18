const express = require("express");
const router = express.Router();
const { addAttackJob } = require("../jobs/attackExecutionJob");
const { validateAttackRequest } = require("../utils/validation");

router.post("/execute", async (req, res, next) => {
    try {
        const { scriptId, params, simulationId, agentId } = req.body;

        // Validate incoming request data
        validateAttackRequest({ scriptId, params, simulationId, agentId });

        // Add job to queue
        const job = await addAttackJob(scriptId, params, simulationId, agentId);

        res.status(202).json({
            success: true,
            message: "Attack execution job added to queue",
            jobId: job.id,
            scriptId: scriptId
        });
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "attack-executor",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

module.exports = router;