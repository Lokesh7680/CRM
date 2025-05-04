// src/modules/leads/lead.service.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchLeads = async (organizationId) => {
  return await prisma.lead.findMany({
    where: { organizationId },
  });
};

const addLead = async (organizationId, data) => {
  return await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone : data.phone,
      source : data.source, // this is missing or undefined
      status: data.status,
      organizationId,
    },
  });
};

const updateLeadById = async (id, data) => {
  return await prisma.lead.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      status: data.status,
    },
  });
};

const deleteLeadById = async (id) => {
  return await prisma.lead.delete({
    where: { id },
  });
};

module.exports = {
  fetchLeads,
  addLead,
  updateLeadById,
  deleteLeadById,
};
