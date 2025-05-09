// src/routes/templateAnalytics.routes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/template/:id", async (req, res) => {
  const templateId = req.params.id;

  try {
    const logs = await prisma.emailLog.findMany({
      where: { campaign_id: templateId },
      select: {
        to_email: true,
        opened: true,
        clicked: true,
      },
    });

    const sent = logs.length;
    const opened = logs.filter((l) => l.opened).length;
    const clicked = logs.filter((l) => l.clicked).length;
    const failed = 0; // Optional: handle delivery errors if tracked

    res.json({ sent, opened, clicked, failed });
  } catch (err) {
    console.error("Error fetching template analytics:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
