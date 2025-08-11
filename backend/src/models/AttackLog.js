const db = require("../config/db");

class AttackLog {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM attack_logs ORDER BY timestamp DESC");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM attack_logs WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(logData) {
        const { simulation_id, agent_id, attack_type, target, outcome, details } = logData;
        const [result] = await db.execute(
            "INSERT INTO attack_logs (simulation_id, agent_id, attack_type, target, outcome, details) VALUES (?, ?, ?, ?, ?, ?)",
            [simulation_id, agent_id, attack_type, target, outcome, JSON.stringify(details)]
        );
        return { id: result.insertId, ...logData };
    }

    static async update(id, logData) {
        const { simulation_id, agent_id, attack_type, target, outcome, details } = logData;
        const [result] = await db.execute(
            "UPDATE attack_logs SET simulation_id = ?, agent_id = ?, attack_type = ?, target = ?, outcome = ?, details = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ?",
            [simulation_id, agent_id, attack_type, target, outcome, JSON.stringify(details), id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM attack_logs WHERE id = ?", [id]);
        return result;
    }

    static async getLogsBySimulationId(simulationId) {
        const [rows] = await db.execute("SELECT * FROM attack_logs WHERE simulation_id = ? ORDER BY timestamp ASC", [simulationId]);
        return rows;
    }

    static async getLogsByAgentId(agentId) {
        const [rows] = await db.execute("SELECT * FROM attack_logs WHERE agent_id = ? ORDER BY timestamp ASC", [agentId]);
        return rows;
    }
}

module.exports = AttackLog;