const db = require("../config/db");

class Agent {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM agents ORDER BY agent_name ASC");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM agents WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(agentData) {
        const { id, agent_name, ip_address, status, associated_staff_id } = agentData;
        const [result] = await db.execute(
            "INSERT INTO agents (id, agent_name, ip_address, status, associated_staff_id) VALUES (?, ?, ?, ?, ?)",
            [id, agent_name, ip_address, status || "offline", associated_staff_id]
        );
        return { id, ...agentData };
    }

    static async update(id, agentData) {
        const { agent_name, ip_address, status, associated_staff_id } = agentData;
        const [result] = await db.execute(
            "UPDATE agents SET agent_name = ?, ip_address = ?, status = ?, associated_staff_id = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?",
            [agent_name, ip_address, status, associated_staff_id, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM agents WHERE id = ?", [id]);
        return result;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            "UPDATE agents SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?",
            [status, id]
        );
        return result;
    }
}

module.exports = Agent;