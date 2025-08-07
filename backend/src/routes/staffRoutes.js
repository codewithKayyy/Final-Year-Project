const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const { validateStaffInput } = require("../utils/validators");

// GET all staff with filtering and search
router.get("/", async (req, res, next) => {
    try {
        const filters = req.query;
        const staff = await Staff.getAll(filters);
        res.json(staff);
    } catch (error) {
        next(error);
    }
});

// GET single staff member by ID
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.getById(id);
        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.json(staff);
    } catch (error) {
        next(error);
    }
});

// POST new staff
router.post("/", async (req, res, next) => {
    try {
        const { id, name, email, college, role, risk } = req.body;
        validateStaffInput({ id, name, email, college, role, risk }, false); // false for not editing

        const result = await Staff.create({ id, name, email, college, role, risk });
        res.status(201).json({
            id: id,
            success: true,
            message: "Staff member added successfully",
            insertId: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("email")) {
                error.statusCode = 409;
                error.message = "Email address already exists";
            } else {
                error.statusCode = 409;
                error.message = "Staff ID already exists";
            }
        }
        next(error);
    }
});

// PUT update staff member
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, college, role, risk } = req.body;
        validateStaffInput({ name, email, college, role, risk }, true); // true for editing

        const result = await Staff.update(id, { name, email, college, role, risk });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.json({
            success: true,
            message: "Staff member updated successfully",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            error.statusCode = 409;
            error.message = "Email address already exists";
        }
        next(error);
    }
});

// DELETE staff member
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Staff.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.json({
            success: true,
            message: "Staff member deleted successfully",
            deletedId: id
        });
    } catch (error) {
        next(error);
    }
});

// GET unique colleges
router.get("/meta/colleges", async (req, res, next) => {
    try {
        const colleges = await Staff.getUniqueColleges();
        res.json(colleges);
    } catch (error) {
        next(error);
    }
});

// GET unique risk levels
router.get("/meta/risks", async (req, res, next) => {
    try {
        const risks = await Staff.getUniqueRiskLevels();
        res.json(risks);
    } catch (error) {
        next(error);
    }
});

// GET staff statistics
router.get("/stats/overview", async (req, res, next) => {
    try {
        const stats = await Staff.getStaffStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;