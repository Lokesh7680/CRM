// src/pages/Opportunities.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Opportunities = () => {
  const [opps, setOpps] = useState([]);
  const [form, setForm] = useState({
    title: "",
    value: "",
    description: "",
    status: "Prospecting",
    closeDate: "",
    contactId: ""
  });
  const [editingId, setEditingId] = useState(null);

  const fetchOpps = async () => {
    try {
      const res = await axios.get("/opportunities");
      setOpps(res.data);
    } catch (err) {
      toast.error("Failed to load opportunities");
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        value: form.value ? Number(form.value) : null,
        closeDate: form.closeDate || null,
        contactId: form.contactId || null
      };

      if (editingId) {
        await axios.put(`/opportunities/${editingId}`, payload);
        toast.success("Updated successfully");
      } else {
        await axios.post("/opportunities", payload);
        toast.success("Added successfully");
      }

      setForm({
        title: "",
        value: "",
        description: "",
        status: "Prospecting",
        closeDate: "",
        contactId: ""
      });
      setEditingId(null);
      fetchOpps();
    } catch (err) {
      toast.error("Failed to save opportunity");
    }
  };

  const handleEdit = (opp) => {
    setEditingId(opp.id);
    setForm({
      title: opp.title || "",
      value: opp.value || "",
      description: opp.description || "",
      status: opp.status || "Prospecting",
      closeDate: opp.closeDate ? opp.closeDate.split("T")[0] : "",
      contactId: opp.contactId || ""
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/opportunities/${id}`);
      toast.success("Deleted successfully");
      fetchOpps();
    } catch (err) {
      toast.error("Failed to delete opportunity");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Opportunities</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="w-full border p-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full border p-2"
        >
          <option>Prospecting</option>
          <option>Proposal Sent</option>
          <option>Negotiation</option>
          <option>Closed Won</option>
          <option>Closed Lost</option>
        </select>
        <input
          type="date"
          value={form.closeDate}
          onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Contact ID (optional)"
          value={form.contactId}
          onChange={(e) => setForm({ ...form, contactId: e.target.value })}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${editingId ? "bg-green-600" : "bg-blue-600"}`}
        >
          {editingId ? "Update Opportunity" : "Add Opportunity"}
        </button>
      </form>

      <ul className="space-y-4">
        {opps.map((opp) => (
          <li key={opp.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{opp.title}</p>
                <p className="text-sm">Value: ${opp.value}</p>
                <p className="text-sm">Status: {opp.status}</p>
                <p className="text-sm">Description: {opp.description || "N/A"}</p>
                <p className="text-sm">
                  Close Date: {opp.closeDate ? opp.closeDate.split("T")[0] : "N/A"}
                </p>
                {opp.contact?.name && (
                  <p className="text-sm text-gray-500">Contact: {opp.contact.name}</p>
                )}
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(opp)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(opp.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Opportunities;
