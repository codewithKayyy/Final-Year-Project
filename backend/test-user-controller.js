const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Simulate the controller login function
async function testLoginController() {
    try {
        const req = {
            body: {
                username: "testuser",
                password: "password123"
            }
        };

        console.log("Testing user controller login function...");
        console.log("Request body:", req.body);

        const { username, password } = req.body;

        if (!username || !password) {
            console.log("Missing username or password");
            return;
        }

        console.log("Finding user by username:", username);
        const user = await User.findByUsername(username);
        console.log("Found user:", user ? "Yes" : "No");

        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("Comparing passwords...");
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("Password mismatch");
            return;
        }

        console.log("Generating token...");
        const generateToken = (id) => {
            return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        };

        const token = generateToken(user.id);
        console.log("Token generated successfully");

        const response = {
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: token,
        };

        console.log("Response would be:", response);
        console.log("✅ Login test successful!");

    } catch (err) {
        console.error("❌ Login test failed:", err);
        console.error("❌ Error stack:", err.stack);
    } finally {
        process.exit(0);
    }
}

testLoginController();