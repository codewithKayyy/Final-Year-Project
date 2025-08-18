// attack-executor/src/config/redis.js
'use strict';

const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    // don't set `maxRetriesPerRequest` to 0; BullMQ recommends `null`
    maxRetriesPerRequest: null,
    enableOfflineQueue: true,
};

// attach password only when present
if (process.env.REDIS_PASSWORD && String(process.env.REDIS_PASSWORD).length > 0) {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

const connection = new Redis(redisConfig);

connection.on('connect', () => {
    console.log(`attack-executor: Connected to Redis at ${redisConfig.host}:${redisConfig.port}`);
});

connection.on('error', (err) => {
    console.error('attack-executor: Redis error:', err?.message || err);
});

module.exports = connection;
