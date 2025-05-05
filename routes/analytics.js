const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// === 1. Open Tracking Pixel ===
router.get("/track/open/:campaignId/:userId", async (req, res) => {
  const { campaignId, userId } = req.params;

  try {
    await prisma.campaignAnalytics.upsert({
      where: {
        campaignId_userId: {
          campaignId,
          userId,
        },
      },
      update: { opened: true },
      create: { campaignId, userId, opened: true },
    });

    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9y9fG+YAAAAASUVORK5CYII=",
      "base64"
    );

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  } catch (err) {
    console.error("Error tracking open:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === 2. Click Tracker and Redirect ===
router.get("/track/click/:campaignId/:userId/:linkId", async (req, res) => {
  const { campaignId, userId, linkId } = req.params;

  try {
    await prisma.campaignAnalytics.upsert({
      where: {
        campaignId_userId_linkId: {
          campaignId,
          userId,
          linkId,
        },
      },
      update: { clicked: true },
      create: { campaignId, userId, linkId, clicked: true },
    });

    // TODO: Replace with dynamic URL logic if needed
    const redirectUrl = "https://example.com/your-offer"; // change to real URL
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error tracking click:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === 3. Analytics Summary ===
router.get("/campaign/:id", async (req, res) => {
  const campaignId = req.params.id;

  try {
    const [sent, opened, clicked] = await Promise.all([
      prisma.campaignAnalytics.count({ where: { campaignId } }),
      prisma.campaignAnalytics.count({ where: { campaignId, opened: true } }),
      prisma.campaignAnalytics.count({ where: { campaignId, clicked: true } }),
    ]);

    const failed = 0; // Extend this if using actual send status

    res.json({ sent, opened, clicked, failed });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
