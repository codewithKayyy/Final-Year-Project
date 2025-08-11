const Redis = require("ioredis");
require("dotenv").config();

const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    maxRetriesPerRequest: null, // Recommended for ioredis with BullMQ
};

const connection = new Redis(redisConfig);

connection.on("connect", () => {
    console.log("Connected to Redis");
});

connection.on("error", (err) => {
    console.error("Redis connection error:", err);
    // Consider graceful shutdown or retry logic here
});

module.exports = connection;