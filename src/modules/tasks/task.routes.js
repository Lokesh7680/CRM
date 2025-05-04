const express = require("express");
const { getTasks, createTask } = require("./task.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getTasks);
router.post("/", authenticate, createTask);

module.exports = router;
