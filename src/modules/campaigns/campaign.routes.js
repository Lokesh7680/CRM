const express = require("express");
const nodemailer = require("nodemailer");
const mjml2html = require("mjml");
require("dotenv").config();
const router = express.Router();
const {
  getCampaigns,
  createCampaign,
  editCampaign,
  removeCampaign,
} = require("./campaign.controller");
const { authenticate } = require("../../middleware/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.status(500).json({ error: "Delete failed" });
  }
});

router.post("/queue/:id", authenticate, async (req, res) => {
  const { id: campaignId } = req.params;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { organization: { include: { users: true } } },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const users = campaign.organization.users;

    for (const user of users) {
      // 1. Track sent in analytics
      await prisma.campaignAnalytics.upsert({
        where: {
          campaignId_userId: {
            campaignId,
            userId: user.id,
          },
        },
        update: {},
        create: {
          campaignId,
          userId: user.id,
          opened: false,
          clicked: false,
        },
      });

      // 2. Build email content with open tracking pixel
      const htmlOutput = mjml2html(`
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello ${user.name},</mj-text>
                <mj-text>Here’s your campaign update!</mj-text>
                <mj-button href=""https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/track/open/${campaignId}/${userId}">
                  Redeem Now
                </mj-button>
                <mj-image src=""https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/track/open/${campaignId}/${userId}" alt="" width="1px" height="1px" />
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `).html;

      // 3. Send email
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: `New Campaign: ${campaign.name}`,
        html: htmlOutput,
      });
    }

    res.json({ message: `Queued & sent emails to ${users.length} users` });
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({ error: "Failed to queue/send emails" });
  }
});


module.exports = router;
