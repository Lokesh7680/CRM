const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchCampaigns = async (organizationId) => {
  return await prisma.campaign.findMany({
    where: { organizationId },
  });
};

const addCampaign = async (organizationId, data) => {
  return await prisma.campaign.create({
    data: {
      name: data.name,
      type: data.type,
      status: data.status || "Draft",
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      organizationId,
    },
  });
};

const updateCampaign = async (id, data) => {
  return await prisma.campaign.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
};

const deleteCampaign = async (id) => {
  return await prisma.campaign.delete({
    where: { id },
  });
};

module.exports = {
  fetchCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
};
