const express = require("express");
const router = express.Router();
const {
  fetchOpportunities,
  fetchClosedWonOpportunities,
  addOpportunity,
  modifyOpportunity,
  removeOpportunity,
  fetchMonthlyRevenue,
  fetchRevenueAnalytics // ✅ Add this here
} = require("./opportunity.controller");


const { authenticate } = require("../../middleware/authMiddleware"); // ✅ updated import

// Get all opportunities
router.get("/", authenticate, fetchOpportunities);

// ✅ Get only Closed Won opportunities
router.get("/closed-won", authenticate, fetchClosedWonOpportunities);

// Create a new opportunity
router.post("/", authenticate, addOpportunity);

// Update opportunity
router.put("/:id", authenticate, modifyOpportunity);

// Delete opportunity
router.delete("/:id", authenticate, removeOpportunity);

router.get("/analytics/monthly-revenue", authenticate, fetchMonthlyRevenue);

router.get("/analytics/revenue", authenticate, fetchRevenueAnalytics);

module.exports = router;
