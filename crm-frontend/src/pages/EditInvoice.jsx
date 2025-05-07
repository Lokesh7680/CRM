// src/pages/EditInvoice.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/invoices/${id}`);
        setInvoice(res.data);
        setItems(res.data.items);
        setTax(res.data.tax);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        toast.error("Failed to load invoice.");
      }
    };
    fetchInvoice();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
    updated[index].total = updated[index].quantity * updated[index].price;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subTotal + (subTotal * tax) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/invoices/${id}`, {
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerPhone: invoice.customerPhone,
        billingAddress: invoice.billingAddress,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        subTotal,
        tax,
        total,
        notes: invoice.notes,
        status: invoice.status,
        items,
      });
      toast.success("Invoice updated successfully!");
      navigate("/invoices");
    } catch (err) {
      console.error("Error updating invoice:", err);
      toast.error("Failed to update invoice.");
    }
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={invoice.customerName}
            onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
            placeholder="Customer Name"
            className="border p-2 rounded"
            required
          />
          <input
            value={invoice.customerEmail}
            onChange={(e) => setInvoice({ ...invoice, customerEmail: e.target.value })}
            placeholder="Customer Email"
            className="border p-2 rounded"
          />
          <input
            value={invoice.billingAddress}
            onChange={(e) => setInvoice({ ...invoice, billingAddress: e.target.value })}
            placeholder="Billing Address"
            className="border p-2 rounded col-span-1 md:col-span-2"
          />
        </div>

        <h3 className="text-lg font-semibold mt-6">Items</h3>
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-4 items-center mb-3">
            <input
              value={item.name}
              onChange={(e) => handleItemChange(idx, "name", e.target.value)}
              placeholder="Item Name"
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              className="border p-2 rounded"
            />
            <div className="p-2 text-center">₹{item.total.toFixed(2)}</div>
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-500 text-sm"
        >
          + Add Item
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            placeholder="Tax %"
            className="border p-2 rounded"
          />

          <select
            value={invoice.status}
            onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="mt-4 text-right">
          <p><strong>Subtotal:</strong> ₹{subTotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> ₹{((subTotal * tax) / 100).toFixed(2)}</p>
          <p className="text-xl"><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Update Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;
