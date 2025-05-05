const express = require("express");
const router = express.Router();
const mjml = require("mjml");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create template
router.post("/", async (req, res) => {
  const { name, mjml: mjmlCode } = req.body;
  try {
    const { html } = mjml(mjmlCode); // render MJML to HTML
    const template = await prisma.campaignTemplate.create({
      data: {
        name,
        mjml: mjmlCode,
        html,
      },
    });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: "Template creation failed" });
  }
});

// Get all templates
router.get("/", async (req, res) => {
  const templates = await prisma.campaignTemplate.findMany();
  res.json(templates);

});

module.exports = router;
