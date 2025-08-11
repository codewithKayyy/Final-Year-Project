const express = require("express");
const User = require("../models/User");

const router = express.Router();

// CREATE USER
router.post("/", async (req, res) => {
    try {
        const result = await User.create(req.body);
        res.status(201).json({ message: "User created", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
    try {
        const result = await User.update(req.params.id, req.body);
        res.json({ message: "User updated", affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        res.json({ message: "User deleted", affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// LOGIN (verify password)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await User.verifyPassword(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
