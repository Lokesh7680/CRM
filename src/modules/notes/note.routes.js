const express = require("express");
const { getNotes, createNote } = require("./note.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getNotes);
router.post("/", authenticate, createNote);

module.exports = router;
