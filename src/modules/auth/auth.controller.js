const { signup, login } = require("./auth.service");

// Handles user signup
const signupController = async (req, res) => {
  try {
    const data = await signup(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginController = async (req, res) => {
  console.log("✅ LoginController reached");  // 👈 Add this

  try {
    const data = await login(req.body);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  signupController,
  loginController,
};
