const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchOrders = async (organizationId) => {
  return await prisma.purchaseOrder.findMany({
    where: { organizationId },
    include: { product: true },
  });
};

const addOrder = async (organizationId, data) => {
    console.log("Creating purchase order:", { organizationId, ...data }); // ✅ Log for debug
    return await prisma.purchaseOrder.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        status: data.status || "Requested",
        organizationId,
      },
    });
  };  

module.exports = { fetchOrders, addOrder };
