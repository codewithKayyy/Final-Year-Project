// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user id to request
            req.user = { id: decoded.id };
            return next();
        } catch (err) {
            console.error("❌ Token validation failed:", err.message);
            return res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }
};
