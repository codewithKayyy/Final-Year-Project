const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function debugUserCreation() {
    try {
        const testUser = {
            username: "testuser",
            email: "test@test.com",
            password: "password123"
        };

        console.log("Testing user creation...");
        console.log("Test data:", testUser);

        // Check if user already exists
        console.log("Checking for existing username...");
        const existingUser = await User.findByUsername(testUser.username);
        console.log("Existing user:", existingUser);

        if (existingUser) {
            console.log("User already exists, trying to login instead...");
            const isMatch = await bcrypt.compare(testUser.password, existingUser.password_hash);
            console.log("Password match:", isMatch);
            return;
        }

        // Check if email already exists
        console.log("Checking for existing email...");
        const existingEmail = await User.findByEmail(testUser.email);
        console.log("Existing email:", existingEmail);

        if (existingEmail) {
            console.log("Email already exists");
            return;
        }

        // Hash password
        console.log("Hashing password...");
        const password_hash = await bcrypt.hash(testUser.password, 10);
        console.log("Password hashed successfully");

        // Create user
        console.log("Creating user...");
        const result = await User.create({
            username: testUser.username,
            email: testUser.email,
            password_hash,
            role: "admin"
        });
        console.log("User created successfully:", result);

        // Verify user was created
        console.log("Verifying user creation...");
        const createdUser = await User.findById(result.insertId);
        console.log("Created user:", createdUser);

    } catch (error) {
        console.error("Error during user creation:", error);
        console.error("Error stack:", error.stack);
    } finally {
        process.exit(0);
    }
}

debugUserCreation();