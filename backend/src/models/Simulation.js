//backend/src/models/Simulation.js
const db = require("../config/db");

class Simulation {
    /**
     * Get all simulations with campaign info
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT s.*, c.name AS campaign_name, c.type AS campaign_type
            FROM simulations s
            LEFT JOIN campaigns c ON s.campaign_id = c.id
            ORDER BY s.created_at DESC
        `);
        return rows;
    }

    /**
     * Get simulation by ID with campaign info
     */
    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT s.*, c.name AS campaign_name, c.type AS campaign_type
            FROM simulations s
            LEFT JOIN campaigns c ON s.campaign_id = c.id
            WHERE s.id = ?
        `, [id]);
        return rows[0];
    }

    /**
     * Get simulations by campaign ID
     */
    static async getByCampaignId(campaignId) {
        const [rows] = await db.execute(`
            SELECT s.*, c.name AS campaign_name
            FROM simulations s
            LEFT JOIN campaigns c ON s.campaign_id = c.id
            WHERE s.campaign_id = ?
            ORDER BY s.created_at DESC
        `, [campaignId]);
        return rows;
    }

    /**
     * Create simulation (with campaign_id support)
     */
    static async create(simulationData) {
        const { name, description, scheduled_start, actual_start, status, created_by, campaign_id, type } = simulationData;

        const [result] = await db.execute(
            `INSERT INTO simulations (name, description, scheduled_start, actual_start, status, created_by, campaign_id, type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, scheduled_start || null, actual_start || null, status || "draft", created_by || 1, campaign_id || null, type || "phishing"]
        );

        return { id: result.insertId, ...simulationData };
    }

    /**
     * Update simulation (with campaign_id support)
     */
    static async update(id, simulationData) {
        const { name, description, scheduled_start, actual_start, status, campaign_id, type, target_agents } = simulationData;

        // Build dynamic query based on provided fields
        const updates = [];
        const params = [];

        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (scheduled_start !== undefined) {
            updates.push('scheduled_start = ?');
            params.push(scheduled_start || null);
        }
        if (actual_start !== undefined) {
            updates.push('actual_start = ?');
            params.push(actual_start || null);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }
        if (campaign_id !== undefined) {
            updates.push('campaign_id = ?');
            params.push(campaign_id || null);
        }
        if (type !== undefined) {
            updates.push('type = ?');
            params.push(type);
        }
        if (target_agents !== undefined) {
            updates.push('target_agents = ?');
            params.push(target_agents);
        }

        // Always update the timestamp
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const query = `UPDATE simulations SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, params);

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

    /**
     * Get campaign stats (aggregate simulation results)
     */
    static async getCampaignStats(campaignId) {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) AS total_simulations,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_simulations,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) AS failed_simulations,
                COUNT(CASE WHEN status = 'running' THEN 1 END) AS running_simulations,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_simulations,
                AVG(TIMESTAMPDIFF(SECOND, scheduled_start, completed_at)) AS avg_duration_seconds
            FROM simulations 
            WHERE campaign_id = ?
        `, [campaignId]);

        return rows[0];
    }
}

module.exports = Simulation;
