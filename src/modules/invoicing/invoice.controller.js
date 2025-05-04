const { fetchInvoices, addInvoice, generateInvoicePDF } = require("./invoice.service");

const getInvoices = async (req, res) => {
  const invoices = await fetchInvoices(req.user.organizationId);
  res.json(invoices);
};

const createInvoice = async (req, res) => {
  try {
    const invoice = await addInvoice(req.user.organizationId, req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const downloadInvoice = async (req, res) => {
    try {
      const invoiceId = req.params.id;
      const stream = await generateInvoicePDF(invoiceId);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoiceId}.pdf`);
      stream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  
module.exports = { getInvoices, createInvoice, downloadInvoice };
