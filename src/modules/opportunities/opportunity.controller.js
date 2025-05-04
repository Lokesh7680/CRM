const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("./opportunity.service");

const fetchOpportunities = async (req, res) => {
  try {
    const data = await getOpportunities(req.user.organizationId);
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

module.exports = {
  fetchOpportunities,
  addOpportunity,
  modifyOpportunity,
  removeOpportunity,
};
