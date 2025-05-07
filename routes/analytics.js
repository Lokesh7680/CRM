const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// === 1. Open Tracking Pixel ===
router.get("/track/open/:campaignId/:userId", async (req, res) => {
  const { campaignId, userId } = req.params;

  try {
    // First ensure minimal fallback
    await prisma.campaignAnalytics.create({
      data: { campaignId, userId, opened: true },
    });
  } catch (err) {
    if (err.code === "P2002") {
      // Already exists, update instead
      await prisma.campaignAnalytics.update({
        where: {
          campaignId_userId: {
            campaignId,
            userId,
          },
        },
        data: { opened: true },
      });
    } else {
      console.error("Error tracking open:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Return pixel
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

    const redirectUrl = "https://aitwater.com/index.php";
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
