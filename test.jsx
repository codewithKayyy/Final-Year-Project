const Queue = require("bull");

const simulationQueue = new Queue("simulation-tasks", {
    redis: { host: "127.0.0.1", port: 6379 }
});

simulationQueue.process(async (job) => {
    console.log(`Executing simulation for user: ${job.data.userId}`);
    // Attack script execution logic here
});
