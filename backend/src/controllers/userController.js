const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE user (Register)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        const result = await User.create({ username, email, password_hash, role });
        res.status(201).json({ message: "User created", id: result.insertId });
    } catch (err) {
        console.error("❌ Create user failed:", err.message);
        res.status(500).json({ error: "Failed to create user" });
    }
};

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("❌ Fetch user failed:", err.message);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

// UPDATE user
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        let password_hash = null;
        if (password) {
            password_hash = await bcrypt.hash(password, 10);
        }

        const result = await User.update(req.params.id, { username, email, password_hash, role });
        res.json({ message: "User updated", affectedRows: result.affectedRows });
    } catch (err) {
        console.error("❌ Update user failed:", err.message);
        res.status(500).json({ error: "Failed to update user" });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        res.json({ message: "User deleted", affectedRows: result.affectedRows });
    } catch (err) {
        console.error("❌ Delete user failed:", err.message);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error("❌ Login failed:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
};
