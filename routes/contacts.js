// routes/contacts.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Get all contacts for current organization
router.get("/", async (req, res) => {
  const orgId = req.user.organizationId;
  try {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Add a new contact
router.post("/", async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  const orgId = req.user.organizationId;
  try {
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        company,
        status: status || "Active",
        organizationId: orgId,
      },
    });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: "Failed to add contact" });
  }
});

// Update contact
router.put("/:id", async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  try {
    const updated = await prisma.contact.update({
      where: { id: req.params.id },
      data: { name, email, phone, company, status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;
