const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

try {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated successfully:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

} catch (error) {
    console.error("JWT Error:", error);
    console.error("Error stack:", error.stack);
}

process.exit(0);