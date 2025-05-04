const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
    process.env.JWT_SECRET,  // ✅ make sure this is correct
    { expiresIn: "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET); // ✅ should match the same
};

module.exports = { generateToken, verifyToken };
