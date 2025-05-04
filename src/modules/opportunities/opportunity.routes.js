const express = require("express");
const {
  fetchOpportunities,
  addOpportunity,
  modifyOpportunity,
  removeOpportunity,
} = require("./opportunity.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, fetchOpportunities);
router.post("/", authenticate, addOpportunity);
router.put("/:id", authenticate, modifyOpportunity);
router.delete("/:id", authenticate, removeOpportunity);

module.exports = router;
