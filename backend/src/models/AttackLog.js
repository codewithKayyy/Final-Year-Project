// backend/src/models/AttackLog.js
const db = require("../services/db");

class AttackLog {
    // ========== CRUD METHODS ==========
    static async getAll() {
        const [rows] = await db.query(
            "SELECT * FROM attack_logs ORDER BY `timestamp` DESC"
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            "SELECT * FROM attack_logs WHERE id = ?",
            [id]
        );
        return rows[0];
    }

    static async create(logData) {
        const {
            simulation_id,
            agent_id,
            attack_type,
            target,
            outcome,
            details
        } = logData;

        const [result] = await db.query(
            `INSERT INTO attack_logs 
            (simulation_id, agent_id, attack_type, target, outcome, details) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [simulation_id, agent_id, attack_type, target, outcome, JSON.stringify(details)]
        );

        return { id: result.insertId, ...logData };
    }

    static async update(id, logData) {
        const {
            simulation_id,
            agent_id,
            attack_type,
            target,
            outcome,
            details
        } = logData;

        const [result] = await db.query(
            `UPDATE attack_logs 
             SET simulation_id = ?, agent_id = ?, attack_type = ?, target = ?, outcome = ?, details = ?, timestamp = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [simulation_id, agent_id, attack_type, target, outcome, JSON.stringify(details), id]
        );

        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            "DELETE FROM attack_logs WHERE id = ?",
            [id]
        );
        return result;
    }

    static async getLogsBySimulationId(simulationId) {
        const [rows] = await db.query(
            "SELECT * FROM attack_logs WHERE simulation_id = ? ORDER BY `timestamp` ASC",
            [simulationId]
        );
        return rows;
    }

    static async getLogsByAgentId(agentId) {
        const [rows] = await db.query(
            "SELECT * FROM attack_logs WHERE agent_id = ? ORDER BY `timestamp` ASC", // Changed here
            [agentId]
        );
        return rows;
    }

    // ========== UPSERT METHOD ==========
    static async updateLog({ simulationId, agentId, scriptId, status, stdout, stderr, error }) {
        const query = `
            INSERT INTO attack_logs
                (simulation_id, agent_id, script_id, status, stdout, stderr, error_message, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                stdout = VALUES(stdout),
                stderr = VALUES(stderr),
                error_message = VALUES(error_message),
                updated_at = NOW()
        `;
        await db.query(query, [
            simulationId,
            agentId,
            scriptId,
            status,
            stdout,
            stderr,
            error
        ]);
    }
}

module.exports = AttackLog;
