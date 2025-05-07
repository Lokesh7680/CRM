import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom"; // ✅ make sure this is imported

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Email");
  const [status, setStatus] = useState("Draft");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editId, setEditId] = useState(null);

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
  }
    

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="Social">Social</option>
        </select>

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

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Campaign" : "Add Campaign"}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Campaigns</h3>
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="border p-3 rounded">
              <div className="font-medium">{c.name} ({c.type})</div>
              <div>Status: {c.status || "Draft"}</div>
              <div>
                {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
              </div>
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleSend(c.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Send Emails
                </button>

                {/* ✅ View Analytics Link */}
                <Link
                  to={`/campaign-analytics/${c.id}`}
                  className="bg-gray-800 text-white px-3 py-1 rounded inline-block"
                >
                  View Analytics
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Campaigns;
