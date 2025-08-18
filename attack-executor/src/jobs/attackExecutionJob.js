const { Queue, Worker } = require("bullmq");
const connection = require("../config/redis");
const { executeScriptInDocker } = require("../services/scriptExecutor");
const axios = require("axios");

const ATTACK_QUEUE_NAME = "attackExecutionQueue";

// Create a new queue
const attackQueue = new Queue(ATTACK_QUEUE_NAME, { connection });

// Create a worker to process jobs from the queue
const attackWorker = new Worker(
    ATTACK_QUEUE_NAME,
    async (job) => {
        const { scriptId, params, simulationId, agentId } = job.data;
        console.log(`Processing job ${job.id}: Executing script ${scriptId} for simulation ${simulationId}`);

        try {
            // Execute the script in a Docker container
            const { stdout, stderr } = await executeScriptInDocker(scriptId, params);

            console.log(`Script ${scriptId} completed. Stdout:`, stdout);
            if (stderr) {
                console.warn(`Script ${scriptId} stderr:`, stderr);
            }

            // Send success results back to main backend via webhook
            await axios.post(
                `${process.env.BACKEND_WEBHOOK_URL}/api/simulations/update-attack-log`,
                {
                    simulationId,
                    agentId,
                    scriptId,
                    status: "completed",
                    stdout,
                    stderr
                }
            );

            return { status: "success", stdout, stderr };
        } catch (error) {
            console.error(`Job ${job.id} failed for script ${scriptId}:`, error.message);

            // Send failure results back to main backend via webhook
            try {
                await axios.post(
                    `${process.env.BACKEND_WEBHOOK_URL}/api/simulations/update-attack-log`,
                    {
                        simulationId,
                        agentId,
                        scriptId,
                        status: "failed",
                        error: error.message
                    }
                );
            } catch (webhookErr) {
                console.error("Failed to send failure webhook to backend:", webhookErr.message);
            }

            throw error; // Mark job as failed in BullMQ
        }
    },
    { connection }
);

// Worker Event Logging
attackWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully.`);
});

attackWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
});

/**
 * Adds a new attack execution job to the queue.
 * @param {string} scriptId - The ID of the script to execute.
 * @param {object} params - Parameters to pass to the script.
 * @param {string} simulationId - ID of the simulation this attack belongs to.
 * @param {string} agentId - ID of the agent this attack targets (optional).
 * @returns {Promise<Job>}
 */
const addAttackJob = async (scriptId, params, simulationId, agentId) => {
    return attackQueue.add(
        "executeAttack", // Job name
        { scriptId, params, simulationId, agentId },
        { attempts: 3, backoff: { type: "exponential", delay: 1000 } } // Retry failed jobs
    );
};

module.exports = { addAttackJob };
