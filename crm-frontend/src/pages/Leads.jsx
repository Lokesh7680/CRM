// src/pages/Leads.jsx
import { useEffect, useState } from "react";
import { unparse } from "papaparse";
import { toast } from "react-toastify";
import { Mail, Phone, Globe, Plus, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "New", source: "" });
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const sourceOptions = [
    "Website", "Social Media", "Email Campaigns", "Referrals",
    "Paid Ads", "Events", "Cold Calls/Emails", "Organic Search"
  ];

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/leads");
      setLeads(res.data);
    } catch (err) {
      toast.error("Failed to fetch leads");
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/leads/${editingId}`, form);
        toast.success("Lead updated");
      } else {
        await axios.post("/leads", form);
        toast.success("Lead added");
      }
      setForm({ name: "", email: "", phone: "", status: "New", source: "" });
      setEditingId(null);
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      toast.error("Error saving lead");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch (err) {
      toast.error("Error deleting lead");
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setShowForm(true);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      source: lead.source || "",
      status: lead.status,
    });
  };

  const handleConvertToContact = async (lead) => {
    try {
      await axios.post("/contacts", {
        name: lead.name,
        email: lead.email,
        status: "Active",
      });
      await axios.delete(`/leads/${lead.id}`);
      toast.success("Converted to contact");
      fetchLeads();
    } catch (err) {
      toast.error("Failed to convert lead");
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (filterStatus === "All" || lead.status === filterStatus) &&
      lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Leads</h2>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/leads-analytics")} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Lead
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{editingId ? "Edit Lead" : "Create Lead"}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="border rounded p-2">
              <option value="">Select Source</option>
              {sourceOptions.map((src) => <option key={src} value={src}>{src}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded p-2">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
            </select>
            <Button type="submit" className="w-full md:col-span-2">{editingId ? "Update Lead" : "Add Lead"}</Button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded p-2">
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Search:</label>
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name" />
        </div>
      </div>

      {/* Lead List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1 w-full">
                <h3 className="text-lg font-semibold text-blue-800 line-clamp-1">{lead.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 line-clamp-1"><Mail className="w-4 h-4" /> {lead.email}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1"><Phone className="w-4 h-4" /> {lead.phone}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1"><Globe className="w-4 h-4" /> {lead.source}</p>
                <span className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded ${
                  lead.status === "New" ? "bg-yellow-100 text-yellow-800" :
                  lead.status === "Qualified" ? "bg-green-100 text-green-700" :
                  "bg-blue-100 text-blue-700"
                }`}>{lead.status}</span>
              </div>
              <div className="flex flex-col gap-1 items-end text-sm font-medium">
                <button onClick={() => handleEdit(lead)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:underline">Delete</button>
                <button onClick={() => handleConvertToContact(lead)} className="text-green-600 hover:underline">Convert</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leads;