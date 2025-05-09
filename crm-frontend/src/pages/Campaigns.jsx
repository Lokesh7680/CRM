import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Card from "../components/ui/Card";


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

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "All" || c.status === filter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    total: campaigns.length,
    draft: campaigns.filter((c) => c.status === "Draft").length,
    active: campaigns.filter((c) => c.status === "Active").length,
    completed: campaigns.filter((c) => c.status === "Completed").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-4xl font-bold">Campaigns</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: summary.total },
          { label: "Draft", value: summary.draft },
          { label: "Active", value: summary.active },
          { label: "Completed", value: summary.completed },
        ].map((card, i) => (
          <Card key={i} className="p-4 text-center shadow-md rounded-2xl">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          </Card>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option>Email</option>
          <option>SMS</option>
          <option>Social</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
          <option>Draft</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" required />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" required />
        <Button type="submit" className="col-span-full">{editId ? "Update" : "Add"} Campaign</Button>
      </form>

      <div className="flex flex-wrap gap-4 items-center">
        <Input placeholder="Search Campaigns" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map((c) => (
          <Card key={c.id} className="p-4 shadow-md rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold">{c.name} ({c.type})</div>
                <div className="text-sm text-gray-600">Status: {c.status}</div>
                <div className="text-sm text-gray-600">
                  {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(c)} variant="secondary">Edit</Button>
                <Button onClick={() => handleDelete(c.id)} variant="destructive">Delete</Button>
                <Button onClick={() => handleSend(c.id)}>Send Emails</Button>
                <Link to={`/campaign-analytics/${c.id}`} className="bg-gray-800 text-white px-3 py-2 rounded">Analytics</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
