const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Utility to generate JWT
const generateToken = (id) => {
    console.log("🔑 JWT_SECRET available:", !!process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// CREATE user (Register)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if username already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        // Ensure role falls back to DB default ("admin") if not provided
        const safeRole = role || "admin";

        const result = await User.create({ username, email, password_hash, role: safeRole });
        const newUser = { id: result.insertId, username, email, role: safeRole };

        res.status(201).json({
            message: "User created",
            user: newUser,
            token: generateToken(newUser.id),
        });
    } catch (err) {
        console.error("❌ Create user failed:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        console.log("🔐 Login attempt for user:", req.body.username);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findByUsername(username);
        if (!user) {
            console.log("❌ User not found:", username);
            return res.status(401).json({ error: "Incorrect username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log("❌ Password mismatch for user:", username);
            return res.status(401).json({ error: "Incorrect username or password" });
        }

        console.log("✅ Login successful for user:", username);
        const token = generateToken(user.id);

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: token,
        });
    } catch (err) {
        console.error("❌ Login failed with error:", err.message);
        console.error("❌ Full error:", err);
        res.status(500).json({ error: "Login failed" });
    }
};

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Hide password_hash in response
        const { password_hash, ...safeUser } = user;
        res.json(safeUser);
    } catch (err) {
        console.error("❌ Fetch user failed:", err);
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

        const safeRole = role || "admin";

        const result = await User.update(req.params.id, { username, email, password_hash, role: safeRole });
        res.json({ message: "User updated", affectedRows: result.affectedRows });
    } catch (err) {
        console.error("❌ Update user failed:", err);
        res.status(500).json({ error: "Failed to update user" });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        res.json({ message: "User deleted", affectedRows: result.affectedRows });
    } catch (err) {
        console.error("❌ Delete user failed:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
};
