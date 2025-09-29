// backend/src/models/PhishingEmail.js
const db = require("../config/db");

class PhishingEmail {
    /**
     * Get all phishing emails (across all campaigns)
     */
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT pe.*, c.name AS campaign_name
            FROM phishing_emails pe
            JOIN campaigns c ON pe.campaign_id = c.id
            ORDER BY pe.created_at DESC
        `);
        // Map database fields to frontend-expected fields
        return rows.map(row => ({
            ...row,
            target_url: row.phishing_url, // Map phishing_url to target_url for frontend compatibility
            version: row.variant_name,    // Map variant_name to version for frontend compatibility
        }));
    }

    /**
     * Get all phishing emails for a campaign
     */
    static async findByCampaignId(campaignId) {
        const [rows] = await db.execute(`
            SELECT *
            FROM phishing_emails
            WHERE campaign_id = ?
            ORDER BY created_at DESC
        `, [campaignId]);
        // Map database fields to frontend-expected fields
        return rows.map(row => ({
            ...row,
            target_url: row.phishing_url,
            version: row.variant_name,
        }));
    }

    /**
     * Get active phishing emails for a campaign
     */
    static async findActiveByCampaignId(campaignId) {
        const [rows] = await db.execute(`
            SELECT *
            FROM phishing_emails
            WHERE campaign_id = ?
              AND is_active = TRUE
            ORDER BY created_at DESC
        `, [campaignId]);
        return rows;
    }

    /**
     * Get phishing email by ID (with campaign name)
     */
    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT pe.*, c.name AS campaign_name
            FROM phishing_emails pe
                     JOIN campaigns c ON pe.campaign_id = c.id
            WHERE pe.id = ?
        `, [id]);
        if (rows[0]) {
            return {
                ...rows[0],
                target_url: rows[0].phishing_url,
                version: rows[0].variant_name,
            };
        }
        return rows[0];
    }

    /**
     * Create a new phishing email template
     */
    static async create(phishingData) {
        const { campaign_id, subject, html_content, from_name, from_email, target_url, version, is_active, template_name } = phishingData;

        const query = `
            INSERT INTO phishing_emails
            (campaign_id, template_name, subject, html_content, from_name, from_email, phishing_url, variant_name, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            campaign_id,
            template_name || subject, // Use subject as template_name if not provided
            subject,
            html_content,
            from_name,
            from_email,
            target_url, // maps to phishing_url in database
            version || "A",
            is_active !== undefined ? is_active : true
        ];

        const [result] = await db.execute(query, params);
        return {
            id: result.insertId,
            ...phishingData,
            target_url: phishingData.target_url, // Ensure frontend field is returned
            version: phishingData.version || "A"
        };
    }

    /**
     * Update phishing email template
     */
    static async update(id, phishingData) {
        const { subject, html_content, from_name, from_email, target_url, version, is_active, template_name } = phishingData;

        const query = `
            UPDATE phishing_emails
            SET template_name = ?,
                subject = ?,
                html_content = ?,
                from_name = ?,
                from_email = ?,
                phishing_url = ?,
                variant_name = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const params = [template_name || subject, subject, html_content, from_name, from_email, target_url, version, is_active, id];
        const [result] = await db.execute(query, params);
        return result;
    }

    /**
     * Delete phishing email template
     */
    static async delete(id) {
        const [result] = await db.execute("DELETE FROM phishing_emails WHERE id = ?", [id]);
        return result;
    }

    /**
     * Try to record an event (click/success) for a given jobId
     * Returns true if the event was newly recorded, false if it already existed.
     */
    static async recordEvent(emailId, jobId, eventType) {
        // INSERT IGNORE uses UNIQUE index (email_id, job_id, event_type) to prevent duplicates
        const query = `
            INSERT IGNORE INTO phishing_email_events (email_id, job_id, event_type)
            VALUES (?, ?, ?)
        `;
        const params = [emailId, jobId, eventType];
        const [result] = await db.execute(query, params);
        // result.affectedRows === 1 when inserted; 0 when ignored (duplicate)
        return result.affectedRows === 1;
    }

    /**
     * Increment click count (idempotent if jobId provided).
     * If jobId is provided, only increments when the event is newly recorded.
     */
    static async incrementClickCount(id, jobId = null) {
        if (jobId) {
            const recorded = await this.recordEvent(id, jobId, "click");
            if (!recorded) return { affected: 0, message: "click already recorded" };
        }

        const [result] = await db.execute(`
            UPDATE phishing_emails
            SET click_count = click_count + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [id]);
        return { affected: result.affectedRows || 0 };
    }

    /**
     * Increment success count (idempotent if jobId provided).
     * If jobId is provided, only increments when the event is newly recorded.
     */
    static async incrementSuccessCount(id, jobId = null) {
        if (jobId) {
            const recorded = await this.recordEvent(id, jobId, "success");
            if (!recorded) return { affected: 0, message: "success already recorded" };
        }

        const [result] = await db.execute(`
            UPDATE phishing_emails
            SET success_count = success_count + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [id]);
        return { affected: result.affectedRows || 0 };
    }

    /**
     * Get performance statistics for a single phishing email
     */
    static async getStats(id) {
        const [rows] = await db.execute(`
            SELECT
                id,
                subject,
                click_count,
                success_count,
                ROUND((success_count / NULLIF(click_count, 0)) * 100, 2) AS conversion_rate
            FROM phishing_emails
            WHERE id = ?
        `, [id]);

        return rows[0];
    }

    /**
     * Get A/B test results for active emails in a campaign
     */
    static async getABTestResults(campaignId) {
        const [rows] = await db.execute(`
            SELECT
                id,
                version,
                subject,
                click_count,
                success_count,
                ROUND((success_count / NULLIF(click_count, 0)) * 100, 2) AS conversion_rate
            FROM phishing_emails
            WHERE campaign_id = ?
              AND is_active = TRUE
            ORDER BY conversion_rate DESC
        `, [campaignId]);
        return rows;
    }
}

module.exports = PhishingEmail;
