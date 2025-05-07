// utils/generateInvoiceHTML.js

module.exports = (invoice) => {
    const itemsHTML = invoice.items
      .map(
        (item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${item.total.toFixed(2)}</td>
        </tr>`
      )
      .join("");
  
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f5f5f5; }
            h2 { margin: 0; }
          </style>
        </head>
        <body>
          <h2>Invoice #${invoice.invoiceNumber}</h2>
          <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${invoice.customerName} (${invoice.customerEmail || "N/A"})</p>
          <p><strong>Address:</strong> ${invoice.billingAddress}</p>
  
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
  
          <p><strong>Subtotal:</strong> ₹${invoice.subTotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> ₹${invoice.tax.toFixed(2)}</p>
          <h3>Total: ₹${invoice.total.toFixed(2)}</h3>
        </body>
      </html>
    `;
  };
  