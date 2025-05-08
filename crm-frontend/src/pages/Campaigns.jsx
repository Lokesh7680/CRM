import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Email");
  const [status, setStatus] = useState("Draft");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, type, status, startDate, endDate };

      if (editId) {
        await axios.put(`/campaigns/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post("/campaigns", payload);
      }

      setName("");
      setType("Email");
      setStatus("Draft");
      setStartDate("");
      setEndDate("");
      fetchCampaigns();
    } catch (err) {
      console.error("Error submitting campaign:", err);
    }
  };

  const handleEdit = (campaign) => {
    setEditId(campaign.id);
    setName(campaign.name);
    setType(campaign.type);
    setStatus(campaign.status || "Draft");
    setStartDate(campaign.startDate.split("T")[0]);
    setEndDate(campaign.endDate.split("T")[0]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/campaigns/${id}`);
      alert("Campaign deleted successfully");
      fetchCampaigns();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert("Failed to delete campaign.");
    }
  };

  const handleSend = async (id) => {
    try {
      await axios.post(`/campaigns/queue/${id}`);
      alert("Emails Queued Successfully!");
    } catch (err) {
      console.error("Queueing failed:", err);
      alert("Failed to queue emails.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "All" || c.status === filter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === "Draft").length,
    active: campaigns.filter(c => c.status === "Active").length,
    completed: campaigns.filter(c => c.status === "Completed").length,
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Campaigns</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-lg font-semibold">{summary.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-lg font-semibold">{summary.draft}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-lg font-semibold">{summary.active}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-lg font-semibold">{summary.completed}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <div>
          <label className="text-sm font-medium">Campaign Name</label>
          <input
            type="text"
            placeholder="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Campaign Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Social">Social</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Campaign" : "Add Campaign"}
        </button>
      </form>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Campaigns"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Campaigns</h3>
        <ul className="space-y-2">
          {filteredCampaigns.map((c) => (
            <li key={c.id} className="border p-3 rounded bg-white shadow">
              <div className="font-medium">{c.name} ({c.type})</div>
              <div>Status: {c.status || "Draft"}</div>
              <div>
                {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
              </div>
              <div className="space-x-2 mt-2">
                <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                <button onClick={() => handleSend(c.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Send Emails</button>
                <Link to={`/campaign-analytics/${c.id}`} className="bg-gray-800 text-white px-3 py-1 rounded inline-block">View Analytics</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Campaigns;
