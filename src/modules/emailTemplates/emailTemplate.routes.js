// 📁 src/modules/emailTemplates/emailTemplate.routes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mjml2html = require("mjml");

// Get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await prisma.campaignTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Create or Update
router.post("/", async (req, res) => {
  const { name, mjml, id } = req.body;
  try {
    const { html } = mjml2html(mjml);

    let template;
    if (id) {
      template = await prisma.campaignTemplate.update({
        where: { id },
        data: { name, mjml, html },
      });
    } else {
      template = await prisma.campaignTemplate.create({
        data: { name, mjml, html },
      });
    }
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: "Template save failed" });
  }
});

// Delete template
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.campaignTemplate.delete({ where: { id } });
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
