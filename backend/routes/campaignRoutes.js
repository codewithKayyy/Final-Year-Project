const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.get('/overview', campaignController.getOverview);
router.get('/campaigns', campaignController.getCampaigns);

module.exports = router;