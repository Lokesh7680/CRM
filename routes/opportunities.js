// routes/opportunities.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Get all opportunities for current org
router.get("/", async (req, res) => {
  try {
    const opportunities = await prisma.opportunity.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { createdAt: "desc" },
      include: { contact: true },
    });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch opportunities" });
  }
});

// Add a new opportunity
router.post("/", async (req, res) => {
  const { title, value, status, closeDate, contactId } = req.body;
  try {
    const newOpportunity = await prisma.opportunity.create({
      data: {
        title,
        value: parseFloat(value),
        status,
        closeDate: new Date(closeDate),
        contactId,
        organizationId: req.user.organizationId,
      },
    });
    res.status(201).json(newOpportunity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an opportunity
router.put("/:id", async (req, res) => {
  const { title, value, status, closeDate, contactId } = req.body;
  try {
    const updated = await prisma.opportunity.update({
      where: { id: req.params.id },
      data: {
        title,
        value: parseFloat(value),
        status,
        closeDate: new Date(closeDate),
        contactId,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete opportunity
router.delete("/:id", async (req, res) => {
  try {
    await prisma.opportunity.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete opportunity" });
  }
});

module.exports = router;
