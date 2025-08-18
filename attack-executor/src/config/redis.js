// attack-executor/src/config/redis.js
const Redis = require("ioredis");
require("dotenv").config();

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1", // fallback to local
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // ✅ recommended for BullMQ & long-running queues
};

const connection = new Redis(redisConfig);

// --- Logging ---
connection.on("connect", () => {
    console.log("✅ Connected to Redis");
});

connection.on("error", (err) => {
    console.error("❌ Redis connection error:", err.message);
    // TODO: implement graceful shutdown or retry strategy if needed
});

module.exports = connection;
