const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

router.post("/:campaignId", async (req, res) => {
  const { campaignId } = req.params;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const contacts = await prisma.contact.findMany({
      where: { organizationId: campaign.organizationId },
    });

    const emailData = contacts.map((contact) => ({
      to: contact.email,
      subject: campaign.name,
      campaignId: campaign.id,
      userId: contact.id,
      firstName: contact.firstName || "User",
      couponCode: campaign.couponCode || "WELCOME100",
      expiryDate:
        campaign.expiryDate?.toISOString().split("T")[0] || "2025-12-31",
    }));

    // ✅ Instead of axios, call your internal logic directly
    for (const email of emailData) {
      const {
        to,
        subject,
        campaignId,
        userId,
        firstName,
        couponCode,
        expiryDate,
      } = email;

      const { spawn } = require("child_process");
      spawn("celery", [
        "-A",
        "email_worker.worker",
        "call",
        "send_email_task",
        "--args",
        JSON.stringify([
          to,
          subject,
          campaignId,
          userId,
          firstName,
          couponCode,
          expiryDate,
        ]),
      ]);
    }

    res.json({ message: "Emails queued successfully!" });
  } catch (err) {
    console.error("❌ Queueing failed:", err);
    res.status(500).json({ error: "Queueing failed" });
  }
});


// ✅ Route: Internal POST route for sending emails via Celery
router.post("/queue-email", async (req, res) => {
  const { emails } = req.body;

  try {
    for (const email of emails) {
      const { to, subject, campaignId, userId, firstName, couponCode, expiryDate } = email;
      console.log("Final args:", [
        email.to,
        email.subject,
        email.campaignId,
        email.userId,
        email.firstName,
        email.couponCode,
        email.expiryDate
      ]);
      
      // 🔥 Trigger Celery via spawn (non-blocking)
      const { spawn } = require("child_process");
      spawn("celery", [
        "-A",
        "email_worker.worker",
        "call",
        "send_email_task",
        "--args",
        JSON.stringify([to, subject, campaignId, userId, firstName, couponCode, expiryDate]),
      ]);
    }

    res.json({ message: "Emails sent to Celery queue." });
  } catch (error) {
    console.error("❌ Celery trigger failed:", error);
    res.status(500).json({ error: "Email queuing failed" });
  }
});

module.exports = router;
