const { fetchCampaigns, addCampaign } = require("./campaign.service");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await fetchCampaigns(req.user.organizationId);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await addCampaign(req.user.organizationId, req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getCampaigns, createCampaign };
