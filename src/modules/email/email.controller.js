const Redis = require("ioredis");
const redis = new Redis(); // Defaults to localhost:6379

const queueEmails = async (req, res) => {
  try {
    const { emails } = req.body;

    for (const email of emails) {
      await redis.rpush("email_queue", JSON.stringify(email));
    }

    res.status(200).json({ message: "Emails queued successfully" });
  } catch (err) {
    console.error("Queueing failed:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { queueEmails };
