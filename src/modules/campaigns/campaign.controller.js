// src/modules/campaigns/campaign.controller.js
const {
  fetchCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} = require("./campaign.service");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await fetchCampaigns(req.user.organizationId);
    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: err.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const newCampaign = await addCampaign(req.user.organizationId, req.body);
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(400).json({ error: err.message });
  }
};

const editCampaign = async (req, res) => {
  try {
    const updated = await updateCampaign(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating campaign:", err);
    res.status(400).json({ error: err.message });
  }
};

const removeCampaign = async (req, res) => {
  try {
    await deleteCampaign(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getCampaigns,
  createCampaign,
  editCampaign,
  removeCampaign,
};
