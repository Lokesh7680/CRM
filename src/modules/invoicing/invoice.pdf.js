const PDFDocument = require("pdfkit");
const { Readable } = require("stream");

const createPDFStream = (invoice) => {
  const doc = new PDFDocument();
  const stream = new Readable().wrap(doc);

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.text(`Customer: ${invoice.customerName}`);
  doc.text(`Email: ${invoice.customerEmail}`);
  doc.moveDown();

  doc.text("Items:");
  invoice.items.forEach((item, idx) => {
    doc.text(`${idx + 1}. ${item.name} - ₹${item.price} x ${item.quantity}`);
  });

  doc.moveDown();
  doc.text(`Tax: ${invoice.taxPercent}%`);
  doc.text(`Total: ₹${invoice.totalAmount}`);

  doc.end();
  return stream;
};

module.exports = { createPDFStream };
