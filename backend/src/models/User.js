// backend/src/models/User.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
    static async create(userData) {
        const { username, email, password, role } = userData;
        const password_hash = await bcrypt.hash(password, 10); // Hash password
        const [result] = await db.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [username, email, password_hash, role || "user"]
        );
        return result;
    }

    static async findByUsername(username) {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    }

    static async update(id, userData) {
        const { username, email, role } = userData;
        let query = "UPDATE users SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        let params = [username, email, role, id];

        if (userData.password) {
            const password_hash = await bcrypt.hash(userData.password, 10);
            query = "UPDATE users SET username = ?, email = ?, password_hash = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            params = [username, email, password_hash, role, id];
        }
        const [result] = await db.execute(query, params);
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return result;
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;