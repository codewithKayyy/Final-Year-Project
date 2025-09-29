// backend/src/models/Telemetry.js
const db = require("../config/db");

const Telemetry = {
    async save(agentId, data) {
        const query = `
            INSERT INTO telemetry (
                agent_id, hostname, platform, arch, node_version, uptime,
                cpu_count, cpu_model, load_average, total_memory_mb,
                free_memory_mb, memory_usage_percent, status, timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.execute(query, [
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

    async getByAgent(agentId, limit = 100) {
        const query = `
            SELECT * FROM telemetry
            WHERE agent_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(query, [agentId, limit]);
        return rows;
    },

    async getLatest(limit = 50) {
        const query = `
            SELECT * FROM telemetry
            ORDER BY timestamp DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(query, [limit]);
        return rows;
    }
};

module.exports = Telemetry;
