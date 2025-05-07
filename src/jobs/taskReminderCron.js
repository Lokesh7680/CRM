// src/jobs/taskReminderCron.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking for task reminders...");

  const now = new Date();
  const tasks = await prisma.task.findMany({
    where: {
      reminderTime: {
        lte: now,
      },
      notified: false,
    },
  });

  for (const task of tasks) {
    if (!task.createdBy) continue;

    try {
      await transporter.sendMail({
        from: `"CRM Task Reminder" <${process.env.SMTP_USER}>`,
        to: task.createdBy,
        subject: `🔔 Reminder: ${task.title}`,
        html: `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleString()}</p>
        `,
      });

      await prisma.task.update({
        where: { id: task.id },
        data: { notified: true },
      });

      console.log(`📧 Email sent to ${task.createdBy} for task ${task.title}`);
    } catch (error) {
      console.error(`❌ Failed to send mail to ${task.createdBy}:`, error.message);
    }
  }
});
