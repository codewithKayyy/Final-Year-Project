// backend/src/models/Telemetry.js
const db = require("../services/db");

const Telemetry = {
    /**
     * Save telemetry data from an agent
     */
    async save(agentId, data) {
        const query = `
            INSERT INTO telemetry (
                agent_id, hostname, platform, arch, node_version, uptime,
                cpu_count, cpu_model, load_average, total_memory_mb,
                free_memory_mb, memory_usage_percent, status, timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [
            agentId,
            data.hostname || null,
            data.platform || null,
            data.arch || null,
            data.nodeVersion || null,
            data.uptime || null,
            data.cpuCount || null,
            data.cpuModel || null,
            data.loadAverage || null,
            data.totalMemoryMB || null,
            data.freeMemoryMB || null,
            data.memoryUsagePercent || null,
            data.status || null,
            data.timestamp ? new Date(data.timestamp) : new Date()
        ]);
    },

    /**
     * Get telemetry logs for a specific agent
     */
    async getByAgent(agentId, limit = 100) {
        const query = `
            SELECT * FROM telemetry
            WHERE agent_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        `;
        return await db.query(query, [agentId, limit]);
    },

    /**
     * Get the latest telemetry logs across all agents
     */
    async getLatest(limit = 50) {
        const query = `
            SELECT * FROM telemetry
            ORDER BY timestamp DESC
            LIMIT ?
        `;
        return await db.query(query, [limit]);
    }
};

module.exports = Telemetry;
