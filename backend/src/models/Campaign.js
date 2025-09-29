//backend/src/models/Campaign.js
const db = require("../config/db");
const PhishingEmail = require("./PhishingEmail");

class Campaign {
    /**
     * Get all campaigns with simulation count
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT c.*, COUNT(s.id) AS simulation_count
            FROM campaigns c
            LEFT JOIN simulations s ON c.id = s.campaign_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);
        return rows;
    }

    /**
     * Get campaign by ID (with simulation count)
     */
    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT c.*, COUNT(s.id) AS simulation_count
            FROM campaigns c
            LEFT JOIN simulations s ON c.id = s.campaign_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);
        return rows[0];
    }

    /**
     * Get campaign with all its simulations
     */
    static async getWithSimulations(id) {
        const [campaignRows] = await db.execute(`
            SELECT c.*, COUNT(s.id) AS simulation_count
            FROM campaigns c
            LEFT JOIN simulations s ON c.id = s.campaign_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);

        if (!campaignRows[0]) return null;

        const [simulationRows] = await db.execute(`
            SELECT s.* 
            FROM simulations s 
            WHERE s.campaign_id = ? 
            ORDER BY s.start_time DESC
        `, [id]);

        return { ...campaignRows[0], simulations: simulationRows };
    }

    static async create(campaignData) {
        const { name, description, type, status, participant_count, click_rate, report_rate, created_by } = campaignData;
        const [result] = await db.execute(
            `INSERT INTO campaigns (name, description, type, status, participant_count, click_rate, report_rate, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, type, status || "draft", participant_count || 0, click_rate || 0, report_rate || 0, created_by || 1]
        );
        return { id: result.insertId, ...campaignData };
    }

    static async update(id, campaignData) {
        const { name, description, type, status, participant_count, click_rate, report_rate } = campaignData;
        const [result] = await db.execute(
            `UPDATE campaigns
             SET name = ?, description = ?, type = ?, status = ?, participant_count = ?, click_rate = ?, report_rate = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, description, type, status, participant_count, click_rate, report_rate, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute("DELETE FROM campaigns WHERE id = ?", [id]);
        return result;
    }


    /**
     * Get campaign with all its phishing email templates
     */
    static async getWithPhishingEmails(id) {
        const [campaignRows] = await db.execute(`
            SELECT c.*, COUNT(pe.id) AS email_template_count
            FROM campaigns c
            LEFT JOIN phishing_emails pe ON c.id = pe.campaign_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);

        if (!campaignRows[0]) return null;

        const phishingEmails = await PhishingEmail.findByCampaignId(id);

        return {
            ...campaignRows[0],
            phishing_emails: phishingEmails
        };
    }

    /**
     * Get campaign performance stats with phishing email data
     */
    static async getPerformanceStats(id) {
        const [rows] = await db.execute(`
            SELECT 
                c.*,
                COUNT(s.id) AS total_simulations,
                COUNT(CASE WHEN s.status = 'completed' THEN 1 END) AS completed_simulations,
                COUNT(CASE WHEN s.status = 'failed' THEN 1 END) AS failed_simulations,
                COUNT(pe.id) AS total_email_templates,
                SUM(pe.click_count) AS total_clicks,
                SUM(pe.success_count) AS total_successes,
                AVG(s.success_rate) AS avg_success_rate,
                SUM(s.participant_count) AS total_participants,
                AVG(s.click_rate) AS avg_click_rate,
                AVG(s.report_rate) AS avg_report_rate
            FROM campaigns c
            LEFT JOIN simulations s ON c.id = s.campaign_id
            LEFT JOIN phishing_emails pe ON c.id = pe.campaign_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);

        return rows[0];
    }
}

module.exports = Campaign;
