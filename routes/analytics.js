const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// === 1. Open Tracking Pixel ===
router.get("/track/open/:campaignId/:userId", async (req, res) => {
  const { campaignId, userId } = req.params;

  try {
    // Ensure campaign and user exist before create/update
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!campaign || !user) {
      return res.status(404).json({ error: "Campaign or User not found" });
    }

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
  } catch (err) {
    console.error("Error tracking open:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9y9fG+YAAAAASUVORK5CYII=",
    "base64"
  );

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": pixel.length,
  });
  res.end(pixel);
});

// === 2. Click Tracking ===
router.get("/track/click/:campaignId/:userId/:linkId", async (req, res) => {
  const { campaignId, userId, linkId } = req.params;

  try {
    // Ensure all related entities exist
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const link = await prisma.campaignLink.findUnique({ where: { id: linkId } });

    if (!campaign || !user || !link) {
      return res.status(404).json({ error: "Campaign/User/Link not found" });
    }

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

    const redirectUrl = link.url || "https://aitwater.com/index.php";
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error tracking click:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === 3. Campaign Analytics Summary ===
router.get("/campaign/:id", async (req, res) => {
  const campaignId = req.params.id;

  try {
    const analytics = await prisma.campaignAnalytics.findMany({
      where: { campaignId },
      select: {
        userId: true,
        opened: true,
        clicked: true,
      },
    });

    const userMap = new Map();

    analytics.forEach(({ userId, opened, clicked }) => {
      if (!userMap.has(userId)) {
        userMap.set(userId, { opened: false, clicked: false });
      }

      const userEntry = userMap.get(userId);
      userMap.set(userId, {
        opened: userEntry.opened || opened,
        clicked: userEntry.clicked || clicked,
      });
    });

    const sent = userMap.size;
    let opened = 0;
    let clicked = 0;

    for (const { opened: o, clicked: c } of userMap.values()) {
      if (o) opened++;
      if (c) clicked++;
    }

    const failed = 0;

    res.json({ sent, opened, clicked, failed });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
