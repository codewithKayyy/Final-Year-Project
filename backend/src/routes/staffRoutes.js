// backend/src/routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/staffController");

// Staff CRUD operations
router.get("/", StaffController.getStaff);
router.get("/stats", StaffController.getStaffStats);
router.get("/with-agents", StaffController.getStaffWithAgents);
router.get("/:id", StaffController.getStaffById);
router.get("/:id/history", StaffController.getStaffHistory);
router.post("/", StaffController.createStaff);
router.put("/:id", StaffController.updateStaff);
router.delete("/:id", StaffController.deleteStaff);

module.exports = router;
