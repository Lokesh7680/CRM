const express = require("express");
const { queueEmails } = require("./email.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

// POST /api/queue-email
router.post("/queue-email", authenticate, queueEmails);

module.exports = router;
