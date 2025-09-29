// backend/src/controllers/phishingEmailController.js
const PhishingEmail = require("../models/PhishingEmail");
const Campaign = require("../models/Campaign");

/**
 * Get all phishing emails (across all campaigns)
 */
exports.getAllPhishingEmails = async (req, res) => {
    try {
        const emails = await PhishingEmail.findAll();
        res.json(emails);
    } catch (err) {
        console.error("Error fetching all phishing emails:", err);
        res.status(500).json({ error: "Failed to fetch phishing emails" });
    }
};

/**
 * Get all phishing emails for a campaign
 */
exports.getPhishingEmailsByCampaign = async (req, res) => {
    try {
        const emails = await PhishingEmail.findByCampaignId(req.params.campaignId);
        res.json(emails);
    } catch (err) {
        console.error("Error fetching phishing emails:", err);
        res.status(500).json({ error: "Failed to fetch phishing emails" });
    }
};

/**
 * Get specific phishing email by ID
 */
exports.getPhishingEmail = async (req, res) => {
    try {
        const email = await PhishingEmail.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ error: "Phishing email not found" });
        }
        res.json(email);
    } catch (err) {
        console.error("Error fetching phishing email:", err);
        res.status(500).json({ error: "Failed to fetch phishing email" });
    }
};

/**
 * Create new phishing email template
 */
exports.createPhishingEmail = async (req, res) => {
    try {
        // Ensure campaign exists
        const campaign = await Campaign.getById(req.body.campaign_id);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        const newEmail = await PhishingEmail.create(req.body);
        res.status(201).json(newEmail);
    } catch (err) {
        console.error("Error creating phishing email:", err);
        res.status(500).json({ error: "Failed to create phishing email" });
    }
};

/**
 * Update phishing email template
 */
exports.updatePhishingEmail = async (req, res) => {
    try {
        const result = await PhishingEmail.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Phishing email not found" });
        }
        res.json({ success: true, message: "Phishing email updated successfully" });
    } catch (err) {
        console.error("Error updating phishing email:", err);
        res.status(500).json({ error: "Failed to update phishing email" });
    }
};

/**
 * Delete phishing email template
 */
exports.deletePhishingEmail = async (req, res) => {
    try {
        const result = await PhishingEmail.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Phishing email not found" });
        }
        res.json({ success: true, message: "Phishing email deleted successfully" });
    } catch (err) {
        console.error("Error deleting phishing email:", err);
        res.status(500).json({ error: "Failed to delete phishing email" });
    }
};

/**
 * Get A/B test results for a campaign
 */
exports.getABTestResults = async (req, res) => {
    try {
        const results = await PhishingEmail.getABTestResults(req.params.campaignId);
        res.json(results);
    } catch (err) {
        console.error("Error fetching A/B test results:", err);
        res.status(500).json({ error: "Failed to fetch A/B test results" });
    }
};

/**
 * Get statistics for a single phishing email
 */
exports.getPhishingEmailStats = async (req, res) => {
    try {
        const stats = await PhishingEmail.getStats(req.params.id);
        if (!stats) {
            return res.status(404).json({ error: "Phishing email not found" });
        }
        res.json(stats);
    } catch (err) {
        console.error("Error fetching phishing email stats:", err);
        res.status(500).json({ error: "Failed to fetch phishing email stats" });
    }
};

/**
 * Record when a phishing email link is clicked
 * Body: { jobId?: string, simulationId?: string, agentId?: string }
 */
exports.recordEmailClick = async (req, res) => {
    try {
        const emailId = req.params.id;
        const { jobId } = req.body || {};

        if (!jobId) {
            // If jobId not provided, fallback to naive increment (non-idempotent)
            await PhishingEmail.incrementClickCount(emailId, null);
            return res.json({ success: true, message: "Click recorded (no jobId provided)" });
        }

        const result = await PhishingEmail.incrementClickCount(emailId, jobId);
        if (result.affected === 0) {
            return res.json({ success: true, message: "Click already recorded (duplicate jobId)" });
        }

        res.json({ success: true, message: "Click recorded successfully" });
    } catch (err) {
        console.error("Error recording click:", err);
        res.status(500).json({ error: "Failed to record click" });
    }
};

/**
 * Record when a phishing email successfully fools a user
 * Body: { jobId?: string, simulationId?: string, agentId?: string }
 */
exports.recordEmailSuccess = async (req, res) => {
    try {
        const emailId = req.params.id;
        const { jobId } = req.body || {};

        if (!jobId) {
            // If jobId not provided, fallback to naive increment (non-idempotent)
            await PhishingEmail.incrementSuccessCount(emailId, null);
            return res.json({ success: true, message: "Success recorded (no jobId provided)" });
        }

        const result = await PhishingEmail.incrementSuccessCount(emailId, jobId);
        if (result.affected === 0) {
            return res.json({ success: true, message: "Success already recorded (duplicate jobId)" });
        }

        res.json({ success: true, message: "Success recorded successfully" });
    } catch (err) {
        console.error("Error recording success:", err);
        res.status(500).json({ error: "Failed to record success" });
    }
};
