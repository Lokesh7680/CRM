const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createPDFStream } = require("./invoice.pdf");

const fetchInvoices = async (organizationId) => {
  return await prisma.invoice.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
};

const addInvoice = async (organizationId, data) => {
  const totalWithTax = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (totalWithTax * (data.taxPercent || 0)) / 100;

  return await prisma.invoice.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      items: data.items,
      totalAmount: totalWithTax + tax,
      taxPercent: data.taxPercent,
      status: data.status || "Draft",
      organizationId,
    },
  });
};

const generateInvoicePDF = async (invoiceId) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
  
    if (!invoice) {
      throw new Error("Invoice not found");
    }
  
    return createPDFStream(invoice);
  };  

module.exports = { fetchInvoices, addInvoice, generateInvoicePDF };
