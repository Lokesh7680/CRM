// src/pages/InvoiceView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Failed to fetch invoice", err);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`/invoices/${id}`);
        navigate("/invoices");
      } catch (err) {
        console.error("Failed to delete invoice", err);
      }
    }
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h2>
        <div className="space-x-3">
          <a
            href={`http://localhost:5000/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download PDF
          </a>
          <Link to={`/invoices/edit/${invoice.id}`} className="text-yellow-600 underline">
            Edit
          </Link>
          <button onClick={handleDelete} className="text-red-600 underline">
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <p><strong>Customer Name:</strong> {invoice.customerName}</p>
        <p><strong>Email:</strong> {invoice.customerEmail}</p>
        <p><strong>Billing Address:</strong> {invoice.billingAddress}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Invoice Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>

        <h4 className="mt-4 font-bold">Items:</h4>
        <ul className="list-disc pl-6">
          {invoice.items.map((item, idx) => (
            <li key={idx}>
              {item.name} - {item.quantity} × ₹{item.price} = ₹{item.total}
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t pt-2 text-right">
          <p><strong>Subtotal:</strong> ₹{invoice.subTotal}</p>
          <p><strong>Tax:</strong> ₹{(invoice.subTotal * invoice.tax / 100).toFixed(2)}</p>
          <p className="text-xl"><strong>Total:</strong> ₹{invoice.total}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
