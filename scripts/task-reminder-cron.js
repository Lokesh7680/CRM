// scripts/task-reminder-cron.js
const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter (update with your SMTP settings)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email utility
const sendReminderEmail = async (to, subject, body) => {
  await transporter.sendMail({
    from: `CRM Reminder <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: body,
  });
};

// Daily 9AM IST (3:30 AM UTC)
cron.schedule("30 3 * * *", async () => {
  console.log("⏰ Running daily task reminder job");
  const now = new Date();

  const start = new Date(now.setUTCHours(0, 0, 0, 0));
  const end = new Date(now.setUTCHours(23, 59, 59, 999));

  const tasks = await prisma.task.findMany({
    where: {
      reminderTime: {
        gte: start,
        lte: end,
      },
    },
  });

  for (const task of tasks) {
    await sendReminderEmail(
      task.createdBy,
      `⏰ Task Reminder: ${task.title}`,
      `Hello,
This is a reminder for your task:

Title: ${task.title}
Description: ${task.description}
Due: ${new Date(task.dueDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
    );
  }

  console.log(`✅ Reminders sent for ${tasks.length} tasks.`);
});
