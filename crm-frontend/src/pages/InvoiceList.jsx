// src/pages/InvoiceList.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("/invoices");
        setInvoices(res.data);
        setFilteredInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = [...invoices];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate) <= new Date(endDate)
      );
    }

    setFilteredInvoices(filtered);
  }, [statusFilter, startDate, endDate, invoices]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`/invoices/${id}`);
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      } catch (err) {
        console.error("Error deleting invoice:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <Link
        to="/invoices/create"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        + New Invoice
      </Link>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Invoice No</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{inv.invoiceNumber}</td>
              <td className="p-2">{inv.customerName}</td>
              <td className="p-2">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
              <td className="p-2">₹{inv.total.toFixed(2)}</td>
              <td className="p-2">{inv.status}</td>
              <td className="p-2 space-x-2">
                <Link to={`/invoices/edit/${inv.id}`} className="text-green-600 underline">Edit</Link>
                <button onClick={() => handleDelete(inv.id)} className="text-red-600 underline">Delete</button>
                <a
                  href={`https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/api/invoices/${inv.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;