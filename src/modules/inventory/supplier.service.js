const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchSuppliers = async (organizationId) => {
  return await prisma.supplier.findMany({
    where: { organizationId },
  });
};

const addSupplier = async (organizationId, data) => {
  return await prisma.supplier.create({
    data: {
      name: data.name,
      contactEmail: data.contactEmail,
      phone: data.phone,
      organizationId,
    },
  });
};

module.exports = { fetchSuppliers, addSupplier };
