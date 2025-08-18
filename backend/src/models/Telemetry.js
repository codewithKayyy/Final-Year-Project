// backend/src/models/Telemetry.js
const db = require("../services/db");

const Telemetry = {
    async save(agentId, data) {
        const query = `
            INSERT INTO telemetry (agent_id, cpu, memory, network, timestamp)
            VALUES (?, ?, ?, ?, NOW())
        `;
        await db.query(query, [
            agentId,
            data.cpu || null,
            data.memory || null,
            data.network || null
        ]);
    }
};

module.exports = Telemetry;
