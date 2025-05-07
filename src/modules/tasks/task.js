// routes/task.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all tasks for an organization
router.get("/org/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { organizationId: orgId },
      orderBy: { dueDate: "asc" },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const newTask = await prisma.task.create({
      data: req.body,
    });
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
