// ✅ Updated CreateInvoice.jsx with Toasts + Status Dropdown
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0, total: 0 }]);
  const [tax, setTax] = useState(0);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subTotal + (subTotal * tax) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.organizationId) {
      toast.error("User organization ID not found.");
      return;
    }

    try {
      await axios.post("/invoices", {
        invoiceNumber: `INV-${Date.now()}`,
        customerName,
        customerEmail,
        billingAddress,
        invoiceDate: new Date(),
        dueDate: new Date(),
        subTotal,
        tax,
        total,
        notes: "",
        status,
        organizationId: user.organizationId,
        items,
      });
      toast.success("Invoice created successfully!");
      navigate("/invoices");
    } catch (err) {
      console.error("Error creating invoice:", err);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded p-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Customer Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="border p-2 rounded w-full"
              required
            />
            <input
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Customer Email"
              className="border p-2 rounded w-full"
            />
            <input
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="Billing Address"
              className="border p-2 rounded w-full md:col-span-2"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Invoice Items</h3>
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
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="text-blue-500 text-sm"
          >
            + Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            placeholder="Tax %"
            className="border p-2 rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="mt-4 text-right">
          <p className="text-md">
            <span className="font-medium">Subtotal:</span> ₹{subTotal.toFixed(2)}
          </p>
          <p className="text-md">
            <span className="font-medium">Tax:</span> ₹{((subTotal * tax) / 100).toFixed(2)}
          </p>
          <p className="text-xl font-bold mt-2 border-t pt-2">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
