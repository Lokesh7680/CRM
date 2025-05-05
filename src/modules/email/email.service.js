const axios = require("axios");

import { sendQueuedEmails } from "../services/email.service";

const handleTestEmail = () => {
  const emails = [
    {
      to: "sanjuramshetty@gmail.com",
      subject: "Test Email",
      campaignId: "123",
      userId: "456",
      firstName: "Rohit",
      couponCode: "DEAL10",
      expiryDate: "2025-12-31",
    },
  ];

  sendQueuedEmails(emails); // 🔁 Triggers Axios call
};


const sendQueuedEmails = async (emails) => {
  try {
    // ✅ Log payload before sending
    console.log("📤 Sending email payload:", JSON.stringify(emails, null, 2));

    const response = await axios.post(
      "https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/api/queue-email",
      { emails },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email queue response:", response.data);
  } catch (err) {
    console.error("❌ Failed to queue emails:", err.message);
    if (err.response) {
      console.error("🔍 Server responded with:", err.response.data);
    }
  }
};

module.exports = { sendQueuedEmails, handleTestEmail };
