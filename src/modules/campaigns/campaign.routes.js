const express = require("express");
const { getCampaigns, createCampaign } = require("./campaign.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getCampaigns);
router.post("/", authenticate, createCampaign);

module.exports = router;
