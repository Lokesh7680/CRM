const {
  fetchTasks,
  fetchTaskById,
  fetchTasksByOrg,
  addTask,
  modifyTask,
  removeTask,
} = require("./task.service");

// Get all tasks for logged-in user's org
const getTasks = async (req, res) => {
  try {
    const tasks = await fetchTasks(req.user.organizationId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await fetchTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by orgId (for admins/managers)
const getTasksByOrg = async (req, res) => {
  try {
    const tasks = await fetchTasksByOrg(req.params.orgId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const task = await addTask(req.user.organizationId, req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const updated = await modifyTask(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    await removeTask(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  getTasksByOrg,
  createTask,
  updateTask,
  deleteTask,
};
