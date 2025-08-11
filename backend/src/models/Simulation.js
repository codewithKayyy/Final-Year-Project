const db = require("../config/db");

class Simulation {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM simulations ORDER BY start_time DESC");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM simulations WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(simulationData) {
        const { name, description, start_time, end_time, status, created_by_user_id } = simulationData;
        const [result] = await db.execute(
            "INSERT INTO simulations (name, description, start_time, end_time, status, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?)",
            [name, description, start_time, end_time, status || "pending", created_by_user_id]
        );
        return { id: result.insertId, ...simulationData };
    }

    static async update(id, simulationData) {
        const { name, description, start_time, end_time, status } = simulationData;
        const [result] = await db.execute(
            "UPDATE simulations SET name = ?, description = ?, start_time = ?, end_time = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [name, description, start_time, end_time, status, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM simulations WHERE id = ?", [id]);
        return result;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            "UPDATE simulations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [status, id]
        );
        return result;
    }
}

module.exports = Simulation;