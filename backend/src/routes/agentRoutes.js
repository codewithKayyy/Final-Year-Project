// backend/src/routes/agentRoutes.js
const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

// Agent software self-registration and heartbeat
router.post("/register", agentController.registerAgent);

// Admin dashboard routes
router.get("/", agentController.getAgents);
router.get("/unassigned", agentController.getUnassignedAgents);
router.get("/staff/:staffId", agentController.getAgentsByStaff);
router.get("/:id", agentController.getAgentById);
router.put("/:id", agentController.updateAgent);
router.delete("/:id", agentController.deactivateAgent);

module.exports = router;