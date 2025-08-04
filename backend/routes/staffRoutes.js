const express = require("express");
const router = express.Router();

// GET all staff with filtering and search
router.get("/", (req, res) => {
    const db = req.db;
    const { college, risk, search } = req.query;

    // Build the base query
    let query = "SELECT * FROM staff WHERE 1=1";
    const queryParams = [];

    // Add college filter
    if (college && college.trim() !== '') {
        query += " AND college = ?";
        queryParams.push(college.trim());
    }

    // Add risk filter
    if (risk && risk.trim() !== '') {
        query += " AND risk = ?";
        queryParams.push(risk.trim());
    }

    // Add search functionality (searches name, email, and id)
    if (search && search.trim() !== '') {
        query += " AND (name LIKE ? OR email LIKE ? OR id LIKE ?)";
        const searchTerm = `%${search.trim()}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Add ordering
    query += " ORDER BY id ASC";

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error fetching staff:", err);
            return res.status(500).json({
                error: "Database error while fetching staff",
                details: err.message
            });
        }

        // Log the query for debugging (remove in production)
        console.log("Executed query:", query);
        console.log("Query parameters:", queryParams);
        console.log("Results count:", results.length);

        res.json(results);
    });
});

// GET single staff member by ID
router.get("/:id", (req, res) => {
    const db = req.db;
    const { id } = req.params;
    const query = "SELECT * FROM staff WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching staff member:", err);
            return res.status(500).json({
                error: "Database error while fetching staff member",
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Staff member not found" });
        }

        res.json(results[0]);
    });
});

// POST new staff
router.post("/", (req, res) => {
    const db = req.db;
    const { id, name, email, college, role, risk } = req.body;

    // Validation
    if (!id || !name || !email || !college || !role) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["id", "name", "email", "college", "role"],
            received: { id: !!id, name: !!name, email: !!email, college: !!college, role: !!role }
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // College validation
    const validColleges = ['Humanities', 'Health Sciences', 'Basic and Applied Science', 'Education'];
    if (!validColleges.includes(college)) {
        return res.status(400).json({
            error: "Invalid college",
            validColleges: validColleges
        });
    }

    // Risk level validation
    const validRiskLevels = ['Low', 'Medium', 'High'];
    const riskLevel = risk && validRiskLevels.includes(risk) ? risk : 'Low';

    const simulations = "0 / 0";

    const query = `
        INSERT INTO staff (id, name, email, college, role, risk, simulations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [id, name, email, college, role, riskLevel, simulations], (err, result) => {
        if (err) {
            console.error("Error inserting staff:", err);

            // Handle duplicate email or ID error
            if (err.code === "ER_DUP_ENTRY") {
                if (err.message.includes('email')) {
                    return res.status(409).json({ error: "Email address already exists" });
                } else {
                    return res.status(409).json({ error: "Staff ID already exists" });
                }
            }

            return res.status(500).json({
                error: "Database error while adding staff",
                details: err.message
            });
        }

        res.status(201).json({
            id: id,
            success: true,
            message: "Staff member added successfully"
        });
    });
});

// PUT update staff member
router.put("/:id", (req, res) => {
    const db = req.db;
    const { id } = req.params;
    const { name, email, college, role, risk } = req.body;

    // Validation
    if (!name || !email || !college || !role) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["name", "email", "college", "role"],
            received: { name: !!name, email: !!email, college: !!college, role: !!role }
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // College validation
    const validColleges = ['Humanities', 'Health Sciences', 'Basic and Applied Science', 'Education'];
    if (!validColleges.includes(college)) {
        return res.status(400).json({
            error: "Invalid college",
            validColleges: validColleges
        });
    }

    // Risk level validation
    const validRiskLevels = ['Low', 'Medium', 'High'];
    const riskLevel = risk && validRiskLevels.includes(risk) ? risk : 'Low';

    const query = `
        UPDATE staff
        SET name = ?, email = ?, college = ?, role = ?, risk = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.query(query, [name, email, college, role, riskLevel, id], (err, result) => {
        if (err) {
            console.error("Error updating staff:", err);

            // Handle duplicate email error
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: "Email address already exists" });
            }

            return res.status(500).json({
                error: "Database error while updating staff",
                details: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Staff member not found" });
        }

        res.json({
            success: true,
            message: "Staff member updated successfully",
            affectedRows: result.affectedRows
        });
    });
});

// DELETE staff member
router.delete("/:id", (req, res) => {
    const db = req.db;
    const { id } = req.params;

    // First check if staff member exists
    const checkQuery = "SELECT id FROM staff WHERE id = ?";

    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error("Error checking staff existence:", err);
            return res.status(500).json({
                error: "Database error while checking staff",
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Staff member not found" });
        }

        // Proceed with deletion
        const deleteQuery = "DELETE FROM staff WHERE id = ?";

        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error("Error deleting staff:", err);
                return res.status(500).json({
                    error: "Database error while deleting staff",
                    details: err.message
                });
            }

            res.json({
                success: true,
                message: "Staff member deleted successfully",
                deletedId: id
            });
        });
    });
});

// GET staff statistics with filtering
router.get("/stats/overview", (req, res) => {
    const db = req.db;
    const { college, risk } = req.query;

    // Build the base query for statistics
    let query = `
        SELECT 
            COUNT(*) as total_staff,
            COUNT(CASE WHEN risk = 'Low' THEN 1 END) as low_risk,
            COUNT(CASE WHEN risk = 'Medium' THEN 1 END) as medium_risk,
            COUNT(CASE WHEN risk = 'High' THEN 1 END) as high_risk,
            COUNT(DISTINCT college) as total_colleges
        FROM staff WHERE 1=1
    `;
    const queryParams = [];

    // Add filters to statistics query
    if (college && college.trim() !== '') {
        query += " AND college = ?";
        queryParams.push(college.trim());
    }

    if (risk && risk.trim() !== '') {
        query += " AND risk = ?";
        queryParams.push(risk.trim());
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error fetching staff statistics:", err);
            return res.status(500).json({
                error: "Database error while fetching statistics",
                details: err.message
            });
        }

        res.json(results[0]);
    });
});

// GET unique colleges (for dropdown population)
router.get("/meta/colleges", (req, res) => {
    const db = req.db;
    const query = "SELECT DISTINCT college FROM staff ORDER BY college";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching colleges:", err);
            return res.status(500).json({
                error: "Database error while fetching colleges",
                details: err.message
            });
        }

        const colleges = results.map(row => row.college);
        res.json(colleges);
    });
});

// GET unique risk levels (for dropdown population)
router.get("/meta/risks", (req, res) => {
    const db = req.db;
    const query = "SELECT DISTINCT risk FROM staff ORDER BY risk";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching risk levels:", err);
            return res.status(500).json({
                error: "Database error while fetching risk levels",
                details: err.message
            });
        }

        const risks = results.map(row => row.risk);
        res.json(risks);
    });
});

module.exports = router;

