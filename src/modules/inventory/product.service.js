const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchProducts = async (organizationId) => {
  return await prisma.product.findMany({
    where: { organizationId },
    include: { supplier: true }
  });
};

const addProduct = async (organizationId, data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      supplierId: data.supplierId || null,
      organizationId,
    },
  });
};

module.exports = { fetchProducts, addProduct };
