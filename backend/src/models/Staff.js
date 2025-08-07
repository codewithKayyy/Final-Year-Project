const db = require("../config/db");

class Staff {
    static async getAll(filters = {}) {
        let query = "SELECT * FROM staff WHERE 1=1";
        const params = [];

        if (filters.college) {
            query += " AND college = ?";
            params.push(filters.college);
        }
        if (filters.risk) {
            query += " AND risk = ?";
            params.push(filters.risk);
        }
        if (filters.search) {
            query += " AND (name LIKE ? OR email LIKE ? OR id LIKE ?)";
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += " ORDER BY id ASC";
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM staff WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(staffData) {
        const { id, name, email, college, role, risk } = staffData;
        const simulations = "0 / 0"; // Default value
        const [result] = await db.execute(
            "INSERT INTO staff (id, name, email, college, role, risk, simulations) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, name, email, college, role, risk || "Low", simulations]
        );
        return result;
    }

    static async update(id, staffData) {
        const { name, email, college, role, risk } = staffData;
        const [result] = await db.execute(
            "UPDATE staff SET name = ?, email = ?, college = ?, role = ?, risk = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [name, email, college, role, risk || "Low", id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM staff WHERE id = ?", [id]);
        return result;
    }

    static async getUniqueColleges() {
        const [rows] = await db.execute("SELECT DISTINCT college FROM staff ORDER BY college");
        return rows.map(row => row.college);
    }

    static async getUniqueRiskLevels() {
        const [rows] = await db.execute("SELECT DISTINCT risk FROM staff ORDER BY risk");
        return rows.map(row => row.risk);
    }

    static async getStaffStats() {
        const query = `
            SELECT 
                COUNT(*) as total_staff,
                COUNT(CASE WHEN risk = 'Low' THEN 1 END) as low_risk,
                COUNT(CASE WHEN risk = 'Medium' THEN 1 END) as medium_risk,
                COUNT(CASE WHEN risk = 'High' THEN 1 END) as high_risk,
                COUNT(DISTINCT college) as total_colleges
            FROM staff
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    }
}

module.exports = Staff;