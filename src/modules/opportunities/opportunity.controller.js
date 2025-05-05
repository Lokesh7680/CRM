const {
  getOpportunities,
  getClosedWonOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("./opportunity.service");

const { getMonthlyRevenue } = require("./opportunity.service");

const fetchMonthlyRevenue = async (req, res) => {
  try {
    const data = await getMonthlyRevenue(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchOpportunities = async (req, res) => {
  try {
    const data = await getOpportunities(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchClosedWonOpportunities = async (req, res) => {
  try {
    const data = await getClosedWonOpportunities(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addOpportunity = async (req, res) => {
  try {
    const data = await createOpportunity(req.user.organizationId, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const modifyOpportunity = async (req, res) => {
  try {
    const data = await updateOpportunity(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeOpportunity = async (req, res) => {
  try {
    await deleteOpportunity(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const { getRevenueAnalytics } = require("./opportunity.service");

const fetchRevenueAnalytics = async (req, res) => {
  try {
    const data = await getRevenueAnalytics(req.user.organizationId);
    res.json([data]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  fetchOpportunities,
  fetchClosedWonOpportunities, // ✅ Export is required for router to work
  addOpportunity,
  modifyOpportunity,
  removeOpportunity,
  fetchMonthlyRevenue,
  fetchRevenueAnalytics
};
