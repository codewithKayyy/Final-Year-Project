const db = require("../config/db");

class User {
    // CREATE user (expects already-hashed password from controller)
    static async create({ username, email, password_hash, role }) {
        const [result] = await db.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [username, email, password_hash, role || "user"]
        );
        return result;
    }

    // FIND user by username
    static async findByUsername(username) {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0];
    }

    // FIND user by ID
    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    }

    // UPDATE user (expects hashed password if included)
    static async update(id, { username, email, password_hash, role }) {
        let query, params;

        if (password_hash) {
            query = `
                UPDATE users 
                SET username = ?, email = ?, password_hash = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            params = [username, email, password_hash, role, id];
        } else {
            query = `
                UPDATE users 
                SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            params = [username, email, role, id];
        }

        const [result] = await db.execute(query, params);
        return result;
    }

    // DELETE user
    static async delete(id) {
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return result;
    }
}

module.exports = User;
