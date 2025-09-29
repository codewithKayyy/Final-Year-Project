// backend/src/controllers/staffController.js
const Staff = require("../models/Staff");
const db = require("../config/db");

class StaffController {
    static async getStaff(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT
                    id, name, email, department, position, college, phone, risk,
                    location, manager_name, hire_date, is_active, notes,
                    created_at, updated_at
                FROM staff
                WHERE is_active = 1
                ORDER BY name
            `);
            res.json(rows);
        } catch (err) {
            console.error("Error fetching staff:", err);
            res.status(500).json({ error: "Failed to fetch staff" });
        }
    }

    static async getStaffById(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT
                    id, name, email, department, position, college, phone, risk,
                    location, manager_name, hire_date, is_active, notes,
                    created_at, updated_at
                FROM staff
                WHERE id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: "Staff member not found" });
            }

            res.json(rows[0]);
        } catch (err) {
            console.error("Error fetching staff member:", err);
            res.status(500).json({ error: "Failed to fetch staff member" });
        }
    }

    static async createStaff(req, res) {
        try {
            console.log("Creating staff with data:", req.body);
            const {
                name,
                email,
                department,
                position,
                college,
                phone,
                risk,
                location,
                manager_name,
                hire_date,
                notes
            } = req.body;

            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }

            // Check for duplicate email
            const [existing] = await db.execute(
                "SELECT id FROM staff WHERE email = ? AND is_active = 1",
                [email]
            );

            if (existing.length > 0) {
                return res.status(400).json({ error: "Email already exists" });
            }

            const [result] = await db.execute(
                `INSERT INTO staff
                (name, email, department, position, college, phone, risk, location, manager_name, hire_date, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email, department, position, college, phone, risk || 'medium', location, manager_name, hire_date, notes]
            );

            res.status(201).json({
                success: true,
                staffId: result.insertId,
                message: "Staff member created successfully"
            });
        } catch (err) {
            console.error("Error creating staff:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Email already exists" });
            } else {
                res.status(500).json({ error: "Failed to create staff member" });
            }
        }
    }

    static async updateStaff(req, res) {
        try {
            const {
                name,
                email,
                department,
                position,
                college,
                phone,
                risk,
                location,
                manager_name,
                hire_date,
                notes
            } = req.body;

            const staffId = req.params.id;

            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }

            // Check if staff member exists
            const [existingStaff] = await db.execute(
                "SELECT id FROM staff WHERE id = ?",
                [staffId]
            );

            if (existingStaff.length === 0) {
                return res.status(404).json({ error: "Staff member not found" });
            }

            // Check for duplicate email (excluding current staff member)
            const [emailCheck] = await db.execute(
                "SELECT id FROM staff WHERE email = ? AND id != ? AND is_active = 1",
                [email, staffId]
            );

            if (emailCheck.length > 0) {
                return res.status(400).json({ error: "Email already exists" });
            }

            await db.execute(
                `UPDATE staff SET
                name = ?, email = ?, department = ?, position = ?, college = ?,
                phone = ?, risk = ?, location = ?, manager_name = ?, hire_date = ?,
                notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [name, email, department, position, college, phone, risk || 'medium',
                 location, manager_name, hire_date, notes, staffId]
            );

            res.json({
                success: true,
                message: "Staff member updated successfully"
            });
        } catch (err) {
            console.error("Error updating staff:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Email already exists" });
            } else {
                res.status(500).json({ error: "Failed to update staff member" });
            }
        }
    }

    static async deleteStaff(req, res) {
        try {
            const staffId = req.params.id;

            // Check if staff member exists
            const [existingStaff] = await db.execute(
                "SELECT id FROM staff WHERE id = ?",
                [staffId]
            );

            if (existingStaff.length === 0) {
                return res.status(404).json({ error: "Staff member not found" });
            }

            // Soft delete (set is_active to false)
            await db.execute(
                "UPDATE staff SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                [staffId]
            );

            res.json({
                success: true,
                message: "Staff member deleted successfully"
            });
        } catch (err) {
            console.error("Error deleting staff:", err);
            res.status(500).json({ error: "Failed to delete staff member" });
        }
    }

    static async getStaffWithAgents(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT
                    s.id, s.name, s.email, s.department, s.position, s.college,
                    s.phone, s.risk, s.location, s.manager_name, s.hire_date,
                    s.is_active, s.notes, s.created_at, s.updated_at,
                    a.agent_id, a.agent_name, a.status as agent_status
                FROM staff s
                LEFT JOIN agents a ON s.id = a.staff_id AND a.status != 'deactivated'
                WHERE s.is_active = 1
                ORDER BY s.name
            `);
            res.json(rows);
        } catch (err) {
            console.error("Error fetching staff with agents:", err);
            res.status(500).json({ error: "Failed to fetch staff with agents" });
        }
    }

    static async getStaffHistory(req, res) {
        try {
            const staffId = req.params.id;

            // Check if staff member exists
            const [staffCheck] = await db.execute(
                "SELECT id, name FROM staff WHERE id = ?",
                [staffId]
            );

            if (staffCheck.length === 0) {
                return res.status(404).json({ error: "Staff member not found" });
            }

            // Get simulation history for this staff member
            const [history] = await db.execute(`
                SELECT
                    al.id,
                    al.simulation_id,
                    al.attack_type,
                    al.target,
                    al.status,
                    al.outcome,
                    al.details,
                    al.timestamp,
                    s.name as simulation_name,
                    s.type as simulation_type,
                    c.name as campaign_name
                FROM attack_logs al
                LEFT JOIN simulations s ON al.simulation_id = s.id
                LEFT JOIN campaigns c ON al.campaign_id = c.id
                WHERE al.staff_id = ?
                ORDER BY al.timestamp DESC
                LIMIT 50
            `, [staffId]);

            res.json(history);
        } catch (err) {
            console.error("Error fetching staff history:", err);
            res.status(500).json({ error: "Failed to fetch staff history" });
        }
    }

    static async getStaffStats(req, res) {
        try {
            const [stats] = await db.execute(`
                SELECT
                    COUNT(*) as total_staff,
                    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_staff,
                    COUNT(CASE WHEN risk = 'high' THEN 1 END) as high_risk,
                    COUNT(CASE WHEN risk = 'medium' THEN 1 END) as medium_risk,
                    COUNT(CASE WHEN risk = 'low' THEN 1 END) as low_risk,
                    COUNT(DISTINCT department) as departments
                FROM staff
            `);

            res.json(stats[0]);
        } catch (err) {
            console.error("Error fetching staff statistics:", err);
            res.status(500).json({ error: "Failed to fetch staff statistics" });
        }
    }
}

module.exports = StaffController;
