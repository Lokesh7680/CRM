const express = require("express");
const {
  getTasks,
  getTaskById,
  getTasksByOrg,
  createTask,
  updateTask,
  deleteTask,
} = require("./task.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

// 🔐 Protect all routes
router.use(authenticate);

// Get all tasks
router.get("/", getTasks);

// Get tasks by organization
router.get("/org/:orgId", getTasksByOrg);

// Get a specific task
router.get("/:id", getTaskById);

// Create a new task
router.post("/", createTask);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;
