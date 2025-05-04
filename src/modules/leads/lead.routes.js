// src/modules/leads/lead.routes.js
const express = require("express");
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} = require("./lead.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getLeads);
router.post("/", authenticate, createLead);
router.put("/:id", authenticate, updateLead);
router.delete("/:id", authenticate, deleteLead);

module.exports = router;
