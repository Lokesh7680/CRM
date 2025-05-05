// File: src/modules/marketing/campaign.controller.js
const { createCampaign, getAllCampaigns } = require("./campaign.service");

const addCampaign = async (req, res) => {
  try {
    const campaign = await createCampaign(req.user.organizationId, req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const fetchCampaigns = async (req, res) => {
  try {
    const data = await getAllCampaigns(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCampaign,
  fetchCampaigns,
};
