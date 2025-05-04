// src/modules/leads/lead.controller.js
const {
  fetchLeads,
  addLead,
  updateLeadById,
  deleteLeadById,
} = require("./lead.service");

const getLeads = async (req, res) => {
  try {
    const leads = await fetchLeads(req.user.organizationId);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLead = async (req, res) => {
  try {
    const newLead = await addLead(req.user.organizationId, req.body);
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const updated = await updateLeadById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    await deleteLeadById(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
