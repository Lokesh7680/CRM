const { fetchTasks, addTask } = require("./task.service");

const getTasks = async (req, res) => {
  try {
    const tasks = await fetchTasks(req.user.organizationId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await addTask(req.user.organizationId, req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getTasks, createTask };
