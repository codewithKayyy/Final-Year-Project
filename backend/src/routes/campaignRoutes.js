const express = require("express");
const {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require("../controllers/campaignController");

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
    res.json({ message: "Campaigns route is working!" });
});

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.post("/", (req, res, next) => {
    console.log("POST /campaigns hit with body:", req.body);
    createCampaign(req, res, next);
});
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

module.exports = router;