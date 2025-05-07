const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get tasks for logged-in user's org
const fetchTasks = async (organizationId) => {
  return await prisma.task.findMany({
    where: { organizationId },
    orderBy: { dueDate: "asc" },
  });
};

// Get one task by ID
const fetchTaskById = async (id) => {
  return await prisma.task.findUnique({ where: { id } });
};

// Get tasks by orgId (admin usage)
const fetchTasksByOrg = async (orgId) => {
  return await prisma.task.findMany({
    where: { organizationId: orgId },
    orderBy: { dueDate: "asc" },
  });
};

// Create new task
const addTask = async (organizationId, data) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      reminderTime: data.reminderTime ? new Date(data.reminderTime) : null,
      priority: data.priority || "Medium",
      status: data.status || "Pending",
      completed: false,
      assignedTo: data.assignedTo || null,
      createdBy: data.createdBy,
      organizationId,
    },
  });
};

// Update task
const modifyTask = async (id, data) => {
  return await prisma.task.update({
    where: { id },
    data,
  });
};

// Delete task
const removeTask = async (id) => {
  return await prisma.task.delete({ where: { id } });
};

module.exports = {
  fetchTasks,
  fetchTaskById,
  fetchTasksByOrg,
  addTask,
  modifyTask,
  removeTask,
};
