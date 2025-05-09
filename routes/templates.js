const express = require("express");
const router = express.Router();
const mjml = require("mjml");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /api/templates/render – Render MJML to HTML
router.post("/render", (req, res) => {
  const { mjml: mjmlCode } = req.body;

  try {
    const { html, errors } = mjml(mjmlCode || "", { validationLevel: "strict" });

    if (errors.length > 0) {
      console.error("MJML validation errors:", errors);
      return res.status(400).json({ error: "Invalid MJML", details: errors });
    }

    res.json({ html });
  } catch (err) {
    console.error("Render failed:", err);
    res.status(500).json({ error: "Failed to render MJML" });
  }
});

// GET /api/templates – Fetch all templates
router.get("/", async (req, res) => {
  try {
    const templates = await prisma.campaignTemplate.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(templates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// POST /api/templates – Create new template
router.post("/", async (req, res) => {
  const { name, mjml: mjmlCode } = req.body;

  try {
    const { html, errors } = mjml(mjmlCode || "", { validationLevel: "strict" });
    if (errors.length > 0) {
      return res.status(400).json({ error: "Invalid MJML", details: errors });
    }

    const template = await prisma.campaignTemplate.create({
      data: { name, mjml: mjmlCode, html },
    });

    res.status(201).json(template);
  } catch (err) {
    console.error("Error saving template:", err);
    res.status(500).json({ error: "Create failed" });
  }
});

// PUT /api/templates/:id – Update a template
router.put("/:id", async (req, res) => {
  const { name, mjml: mjmlCode } = req.body;

  try {
    const { html, errors } = mjml(mjmlCode || "", { validationLevel: "strict" });
    if (errors.length > 0) {
      return res.status(400).json({ error: "Invalid MJML", details: errors });
    }

    const updated = await prisma.campaignTemplate.update({
      where: { id: req.params.id },
      data: { name, mjml: mjmlCode, html },
    });

    res.json(updated);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Template not found" });
    }
    console.error("Update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE /api/templates/:id – Delete a template
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await prisma.campaignTemplate.delete({
      where: { id: req.params.id },
    });
    res.json(deleted);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Template not found" });
    }
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
