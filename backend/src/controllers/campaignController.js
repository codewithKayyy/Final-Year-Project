// backend/src/controllers/campaignController.js
const Campaign = require("../models/Campaign");

exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.getAll();
        res.json(campaigns);
    } catch (err) {
        console.error("❌ Get all campaigns failed:", err);
        res.status(500).json({ error: "Failed to retrieve campaigns" });
    }
};

exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.getById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(campaign);
    } catch (err) {
        console.error("❌ Get campaign by ID failed:", err);
        res.status(500).json({ error: "Failed to retrieve campaign" });
    }
};

exports.createCampaign = async (req, res) => {
    try {
        console.log("Creating campaign with data:", req.body);
        const newCampaign = await Campaign.create(req.body);
        res.status(201).json(newCampaign);
    } catch (err) {
        console.error("❌ Create campaign failed:", err);
        console.error("Error details:", err.message);
        console.error("SQL error code:", err.code);
        res.status(500).json({ error: "Failed to create campaign", details: err.message });
    }
};

exports.updateCampaign = async (req, res) => {
    try {
        const updatedCampaign = await Campaign.update(req.params.id, req.body);
        res.json(updatedCampaign);
    } catch (err) {
        console.error("❌ Update campaign failed:", err);
        res.status(500).json({ error: "Failed to update campaign" });
    }
};

exports.deleteCampaign = async (req, res) => {
    try {
        const result = await Campaign.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (err) {
        console.error("❌ Delete campaign failed:", err);
        res.status(500).json({ error: "Failed to delete campaign" });
    }
};