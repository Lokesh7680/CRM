const express = require("express");
const router = express.Router();
const {
  getCampaigns,
  createCampaign,
  editCampaign,
  removeCampaign,
} = require("./campaign.controller");
const { authenticate } = require("../../middleware/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all campaigns
router.get("/", authenticate, getCampaigns);

// Create a new campaign
router.post("/", authenticate, createCampaign);

router.put("/:id", async (req, res) => {
  const { name, type, startDate, endDate, status } = req.body;
  const { id } = req.params;
  try {
    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        type,
        status, // ✅ ADD THIS
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete a campaign (✅ FIXED)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
