// backend/src/routes/systemRoutes.js
const express = require('express');
const SystemController = require('../controllers/systemController');

const router = express.Router();

// System health endpoint
router.get('/health', SystemController.getSystemHealth);

// Dashboard metrics
router.get('/dashboard-metrics', SystemController.getDashboardMetrics);

// System statistics
router.get('/stats', SystemController.getSystemStats);

module.exports = router;