// src/pages/Opportunities.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Layout } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
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
    setShowForm(true);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Opportunities</h2>
        <div className="flex gap-2">
          <Link to="/opportunities-analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
          <Link to="/opportunities-board">
            <Button variant="outline">
              <Layout className="w-4 h-4 mr-2" /> Kanban View
            </Button>
          </Link>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Opportunity
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Opportunity</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <Input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Value</label>
              <Input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Description</label>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded p-2 w-full">
                <option>Prospecting</option>
                <option>Proposal Sent</option>
                <option>Negotiation</option>
                <option>Closed Won</option>
                <option>Closed Lost</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Close Date</label>
              <Input type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Contact ID (optional)</label>
              <Input type="text" placeholder="Contact ID (optional)" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} />
            </div>
            <Button type="submit" className="w-full md:col-span-2">{editingId ? "Update Opportunity" : "Add Opportunity"}</Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {opps.map((opp) => (
          <div key={opp.id} className="border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1 w-full">
                <h3 className="text-lg font-semibold text-blue-800 line-clamp-1">{opp.title}</h3>
                <p className="text-sm text-gray-600">Value: ${opp.value}</p>
                <p className="text-sm text-gray-600">Status: {opp.status}</p>
                <p className="text-sm text-gray-600">{opp.description || "No description"}</p>
                <p className="text-sm text-gray-600">Close Date: {opp.closeDate ? opp.closeDate.split("T")[0] : "N/A"}</p>
                {opp.contact?.name && (
                  <p className="text-sm text-gray-500">Contact: {opp.contact.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 items-end text-sm font-medium">
                <button onClick={() => handleEdit(opp)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(opp.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;