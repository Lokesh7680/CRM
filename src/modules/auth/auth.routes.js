const express = require("express");
const { signupController, loginController } = require("./auth.controller");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

module.exports = router;
