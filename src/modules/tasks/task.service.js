const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchTasks = async (organizationId) => {
  return await prisma.task.findMany({
    where: { organizationId },
  });
};

const addTask = async (organizationId, data) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      dueDate: new Date(data.dueDate),
      priority: data.priority || "Medium",
      organizationId,
    },
  });
};

module.exports = { fetchTasks, addTask };
