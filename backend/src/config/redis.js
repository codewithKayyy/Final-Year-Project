// backend/src/config/redis.js
'use strict';

require('dotenv').config();
const IORedis = require('ioredis');

const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null, // recommended for BullMQ
    enableOfflineQueue: true,
};

if (process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.length > 0) {
    redisOptions.password = process.env.REDIS_PASSWORD;
}

const connection = new IORedis(redisOptions);

connection.on('connect', () => {
    console.log('backend: Connected to Redis at', `${redisOptions.host}:${redisOptions.port}`);
});
connection.on('error', (err) => {
    console.error('backend: Redis error:', err.message);
});

module.exports = connection;
