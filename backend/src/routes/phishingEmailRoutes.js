// backend/src/routes/phishingEmailRoutes.js
const express = require("express");
const router = express.Router();
const phishingEmailController = require("../controllers/phishingEmailController");

// GET all phishing emails (across all campaigns)
router.get("/", phishingEmailController.getAllPhishingEmails);

// GET all phishing emails for a campaign
router.get("/campaign/:campaignId", phishingEmailController.getPhishingEmailsByCampaign);

// GET specific phishing email
router.get("/:id", phishingEmailController.getPhishingEmail);

// GET phishing email stats (clicks, successes, etc.)
router.get("/stats/:id", phishingEmailController.getPhishingEmailStats);

// POST create new phishing email
router.post("/", phishingEmailController.createPhishingEmail);

// PUT update phishing email
router.put("/:id", phishingEmailController.updatePhishingEmail);

// DELETE phishing email
router.delete("/:id", phishingEmailController.deletePhishingEmail);

// GET A/B test results
router.get("/:campaignId/ab-test", phishingEmailController.getABTestResults);

// POST record email click
router.post("/:id/click", phishingEmailController.recordEmailClick);

// POST record email success
router.post("/:id/success", phishingEmailController.recordEmailSuccess);

module.exports = router;
