// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Missing or invalid Authorization header");
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Debug log
    console.log("🔐 Received Token:", token);
    console.log("🛡️ JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
