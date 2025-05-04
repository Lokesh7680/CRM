const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOpportunities = async (organizationId) => {
  return prisma.opportunity.findMany({
    where: { organizationId },
  });
};

const createOpportunity = async (organizationId, data) => {
  return prisma.opportunity.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      value: parseFloat(data.value),  // Ensure it's a number
      organizationId,
    },
  });
};

const updateOpportunity = async (id, data) => {
  return prisma.opportunity.update({
    where: { id },
    data,
  });
};

const deleteOpportunity = async (id) => {
  return prisma.opportunity.delete({
    where: { id },
  });
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
