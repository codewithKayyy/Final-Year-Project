// attack-executor/src/jobs/attackExecutionJob.js
'use strict';

const { Queue, Worker } = require('bullmq');
const connection = require('../config/redis');
const { executeScriptInDocker } = require('../services/scriptExecutor');
const axios = require('axios');

const ATTACK_QUEUE_NAME = 'attackExecutionQueue';

// create queue instance (used by other modules if needed)
const attackQueue = new Queue(ATTACK_QUEUE_NAME, { connection });

// tiny helper to deep-clone job params (avoid mutating job.data)
const deepClone = (obj) => {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return Object.assign({}, obj);
    }
};

// axios clients (API + webhook) with reasonable timeouts and baseURL fallbacks
const apiClient = axios.create({
    baseURL: process.env.BACKEND_API_URL || 'http://localhost:3001',
    timeout: Number(process.env.BACKEND_API_TIMEOUT_MS || 5000),
    headers: { 'Content-Type': 'application/json' },
});

const webhookClient = axios.create({
    baseURL: process.env.BACKEND_WEBHOOK_URL || process.env.BACKEND_API_URL || 'http://localhost:3001',
    timeout: Number(process.env.BACKEND_WEBHOOK_TIMEOUT_MS || 5000),
    headers: { 'Content-Type': 'application/json' },
});

const workerOptions = {
    connection,
    // optional: control concurrency if you expect heavy tasks
    // concurrency: Number(process.env.ATTACK_WORKER_CONCURRENCY || 2),
    // lockDuration: Number(process.env.ATTACK_WORKER_LOCK_MS || 120000),
};

const attackWorker = new Worker(
    ATTACK_QUEUE_NAME,
    async (job) => {
        const {
            scriptId,
            params: jobParams = {},
            simulationId,
            agentId,
            emailTemplateId,
        } = job.data;

        const logPrefix = `[job:${job.id} sim:${simulationId || 'n/a'} agent:${agentId || 'n/a'} template:${emailTemplateId || 'n/a'}]`;
        console.log(`${logPrefix} Starting execution of script "${scriptId}"`);

        // clone params so we don't accidentally mutate job.data (Bull may reuse)
        const params = deepClone(jobParams || {});

        try {
            // optional: fetch email template and inject into params (non-fatal)
            if (emailTemplateId) {
                try {
                    const resp = await apiClient.get(`/api/phishing-emails/${emailTemplateId}`);
                    if (resp && resp.data) {
                        params.EMAIL_TEMPLATE = JSON.stringify(resp.data);
                        console.log(`${logPrefix} Loaded email template ${emailTemplateId}`);
                    } else {
                        console.warn(`${logPrefix} Template fetch returned empty payload`);
                    }
                } catch (err) {
                    console.warn(`${logPrefix} Failed to fetch email template ${emailTemplateId}: ${err.message}`);
                }
            }

            // execute the attack script in Docker (or other executor)
            if (typeof executeScriptInDocker !== 'function') {
                throw new Error('executeScriptInDocker is not a function');
            }

            const { stdout = '', stderr = '' } = await executeScriptInDocker(scriptId, params);
            console.log(`${logPrefix} Script "${scriptId}" finished (stdout ${String(stdout).length} chars)`);

            // best-effort: record phishing template metrics (click/send + success heuristic)
            if (emailTemplateId) {
                try {
                    // click => we attempted/sent
                    await apiClient.post(`/api/phishing-emails/${emailTemplateId}/click`);
                    // success heuristic: no stderr output => success
                    if (!stderr || String(stderr).trim() === '') {
                        await apiClient.post(`/api/phishing-emails/${emailTemplateId}/success`);
                    }
                    console.log(`${logPrefix} Recorded template metrics for ${emailTemplateId}`);
                } catch (metricsErr) {
                    console.warn(`${logPrefix} Failed to record template metrics:`, metricsErr.message);
                }
            }

            // notify main backend via webhook (best-effort)
            try {
                await webhookClient.post(`/api/simulations/update-attack-log`, {
                    simulationId,
                    agentId,
                    scriptId,
                    emailTemplateId,
                    status: 'completed',
                    stdout,
                    stderr: stderr || null,
                });
                console.log(`${logPrefix} Sent completion webhook`);
            } catch (webErr) {
                console.error(`${logPrefix} Failed to send completion webhook:`, webErr.message);
            }

            return { status: 'success', stdout, stderr };
        } catch (error) {
            console.error(`${logPrefix} Job failed:`, error?.message || error);

            // Notify backend about failure (best-effort)
            try {
                await webhookClient.post(`/api/simulations/update-attack-log`, {
                    simulationId,
                    agentId,
                    scriptId,
                    emailTemplateId,
                    status: 'failed',
                    error: error?.message || String(error),
                });
                console.log(`${logPrefix} Sent failure webhook`);
            } catch (webhookErr) {
                console.error(`${logPrefix} Failed to send failure webhook:`, webhookErr.message);
            }

            // rethrow so BullMQ marks the job as failed (and will retry if configured)
            throw error;
        }
    },
    workerOptions
);

// worker lifecycle logging
attackWorker.on('completed', (job) => console.log(`[job:${job.id}] Completed`));
attackWorker.on('failed', (job, err) => console.error(`[job:${job.id}] Failed: ${err?.message || err}`));
attackWorker.on('error', (err) => console.error('Worker error:', err?.message || err));

// graceful shutdown helper (useful when process receives SIGINT / SIGTERM)
const shutdown = async () => {
    console.log('attackExecutionJob: shutting down worker & queue...');
    try {
        await attackWorker.close();
        await attackQueue.close();
        // ioredis connection in attack-executor config should be closed by that service's shutdown if needed
        console.log('attackExecutionJob: shutdown complete');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err?.message || err);
        process.exit(1);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Function to add jobs to the queue (called by HTTP API)
const addAttackJob = async (scriptId, params = {}, simulationId, agentId, emailTemplateId = null) => {
    const jobData = {
        scriptId,
        params,
        simulationId,
        agentId,
        emailTemplateId
    };

    const job = await attackQueue.add('executeAttack', jobData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5
    });

    console.log(`[job:${job.id}] Added attack job for script "${scriptId}" (simulation:${simulationId}, agent:${agentId})`);
    return job;
};

module.exports = { attackWorker, attackQueue, addAttackJob };
