const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function debugLogin() {
    try {
        const testLogin = {
            username: "testuser",
            password: "password123"
        };

        console.log("Testing login...");
        console.log("Test data:", testLogin);

        // Find user by username
        console.log("Finding user by username...");
        const user = await User.findByUsername(testLogin.username);
        console.log("Found user:", user);

        if (!user) {
            console.log("User not found");
            return;
        }

        // Compare password
        console.log("Comparing passwords...");
        console.log("Stored hash:", user.password_hash);

        const isMatch = await bcrypt.compare(testLogin.password, user.password_hash);
        console.log("Password match:", isMatch);

        if (isMatch) {
            console.log("Login would be successful");
        } else {
            console.log("Password mismatch");
        }

    } catch (error) {
        console.error("Error during login:", error);
        console.error("Error stack:", error.stack);
    } finally {
        process.exit(0);
    }
}

debugLogin();