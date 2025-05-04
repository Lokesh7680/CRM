// src/pages/Leads.jsx
import { useEffect, useState } from "react";
import { unparse } from "papaparse";
import { toast } from "react-toastify";
import axios from "../api/axios";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "New", source: "" });
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const sourceOptions = [
    "Website",
    "Social Media",
    "Email Campaigns",
    "Referrals",
    "Paid Ads",
    "Events",
    "Cold Calls/Emails",
    "Organic Search"
  ];

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      toast.error("Failed to fetch leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/leads/${editingId}`, form);
        toast.success("Lead updated successfully!");
      } else {
        await axios.post("/leads", form);
        toast.success("Lead added successfully!");
      }
      setForm({ name: "", email: "", phone: "", status: "New", source: "" });
      setEditingId(null);
      fetchLeads();
    } catch (err) {
      console.error("Error saving lead:", err);
      toast.error("Error saving lead");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully!");
      fetchLeads();
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error("Error deleting lead");
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      source: lead.source || "",
      status: lead.status
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
      toast.success("Lead converted to contact!");
      fetchLeads();
    } catch (err) {
      console.error("Conversion failed:", err);
      toast.error("Failed to convert lead");
    }
  };

  const confirm = (action, lead) => {
    setSelectedLead(lead);
    setConfirmAction(() => () => action(lead));
    setShowConfirm(true);
  };

  const handleExportCSV = () => {
    try {
      const filtered = leads.filter(
        (lead) =>
          (filterStatus === "All" || lead.status === filterStatus) &&
          lead.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        toast.info("No data to export");
        return;
      }

      const csvData = unparse(filtered);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to export CSV");
      console.error(error);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (filterStatus === "All" || lead.status === filterStatus) &&
      lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-2"
        />
        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="w-full border p-2"
        >
          <option value="">Select Source</option>
          {sourceOptions.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full border p-2"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
        </select>
        <button
          type="submit"
          className={`${
            editingId ? "bg-green-600" : "bg-blue-600"
          } text-white px-4 py-2 rounded`}
        >
          {editingId ? "Update Lead" : "Add Lead"}
        </button>
      </form>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </div>

        <div>
          <label htmlFor="search" className="mr-2 font-medium">
            Search by Name:
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2"
            placeholder="Enter name"
          />
        </div>
      </div>

      <button
        onClick={handleExportCSV}
        className="bg-gray-700 text-white px-4 py-2 rounded mb-4"
      >
        Export to CSV
      </button>

      <ul className="space-y-4">
        {paginatedLeads.map((lead) => (
          <li key={lead.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm">{lead.email}</p>
                <p className="text-sm">{lead.phone}</p>
                <p className="text-sm">{lead.source}</p>
                <p className="text-sm text-gray-500">{lead.status}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(lead)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirm(() => handleDelete(lead.id), lead)}
                  className="text-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => confirm(handleConvertToContact, lead)}
                  className="text-green-600"
                >
                  Convert
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold">Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredLeads.length / itemsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPage >= Math.ceil(filteredLeads.length / itemsPerPage)
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  confirmAction();
                  setShowConfirm(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
