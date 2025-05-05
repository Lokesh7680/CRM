const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOpportunities = async (organizationId) => {
  return prisma.opportunity.findMany({
    where: { organizationId },
    include: {
      contact: true,
    },
  });
};

const getClosedWonOpportunities = async (organizationId) => {
  return prisma.opportunity.findMany({
    where: {
      organizationId,
      status: "Closed Won"
    },
    include: {
      contact: true,
    },
  });
};

const createOpportunity = async (organizationId, data) => {
  return prisma.opportunity.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      value: data.value ? parseFloat(data.value) : 0,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
      contactId: data.contactId || null,
      organizationId,
    },
  });
};

const updateOpportunity = async (id, data) => {
  return prisma.opportunity.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      value: data.value ? parseFloat(data.value) : 0,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
      contactId: data.contactId || null,
    },
  });
};

const deleteOpportunity = async (id) => {
  return prisma.opportunity.delete({
    where: { id },
  });
};

const getMonthlyRevenue = async (organizationId) => {
  return prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "closeDate") AS month,
      SUM("value") AS revenue
    FROM "Opportunity"
    WHERE "organizationId" = ${organizationId}
      AND "status" = 'Closed Won'
      AND "closeDate" IS NOT NULL
    GROUP BY month
    ORDER BY month;
  `;
};

const getRevenueAnalytics = async (organizationId) => {
  return prisma.opportunity.groupBy({
    by: ['status'],
    where: {
      organizationId,
    },
    _sum: {
      value: true,
    },
  });
};


const getRevenueByStatus = async (organizationId) => {
  return prisma.opportunity.groupBy({
    by: ["status"],
    where: { organizationId },
    _sum: { value: true },
  }).then(results =>
    results.map(r => ({
      status: r.status,
      revenue: r._sum.value || 0
    }))
  );
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getClosedWonOpportunities,
  getMonthlyRevenue,
  getRevenueAnalytics,
  getRevenueByStatus
};
