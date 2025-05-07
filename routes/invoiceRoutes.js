const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const puppeteer = require("puppeteer");
const generateInvoiceHTML = require("../src/utils/generateInvoiceHTML");

const prisma = new PrismaClient();

// 📌 Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

/// 📊 Invoice Stats
router.get("/stats", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();

    const total = invoices.length;
    const paid = invoices.filter((i) => i.status?.toUpperCase() === "PAID").length;
    const pending = invoices.filter((i) => i.status?.toUpperCase() === "PENDING").length;
    const overdue = invoices.filter((i) => i.status?.toUpperCase() === "OVERDUE").length;

    const totalRevenue = invoices
      .filter((i) => i.status?.toUpperCase() === "PAID")
      .reduce((sum, i) => sum + i.total, 0);

    res.json({ total, paid, pending, overdue, totalRevenue });
  } catch (err) {
    console.error("Error fetching invoice stats", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 📌 Get invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

// 📌 Create a new invoice
router.post("/", async (req, res) => {
  const {
    invoiceNumber,
    customerName,
    customerEmail,
    customerPhone,
    billingAddress,
    invoiceDate,
    dueDate,
    subTotal,
    tax,
    total,
    notes,
    status,
    items,
    organizationId,
  } = req.body;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName,
        customerEmail,
        customerPhone,
        billingAddress,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        subTotal,
        tax,
        total,
        notes,
        status,
        organizationId,
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

// 📌 Update invoice
router.put("/:id", async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    billingAddress,
    invoiceDate,
    dueDate,
    subTotal,
    tax,
    total,
    notes,
    status,
    items,
  } = req.body;

  try {
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: req.params.id },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        customerName,
        customerEmail,
        customerPhone,
        billingAddress,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        subTotal,
        tax,
        total,
        notes,
        status,
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update invoice" });
  }
});

// 📌 Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: req.params.id } });
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

// 📌 Generate PDF for invoice
// 📌 Generate PDF for invoice
router.get("/:id/pdf", async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // ✅ for Codespaces/sandbox env
    });

    const page = await browser.newPage();
    const html = generateInvoiceHTML(invoice);
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=Invoice-${invoice.invoiceNumber}.pdf`,
    });

    res.send(pdf);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "Failed to generate invoice PDF" });
  }
});


module.exports = router;
