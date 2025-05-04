// src/pages/Opportunities.jsx
import { useState, useEffect } from "react";
import axios from "../api/axios";

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Prospecting");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", status: "", value: "" });

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get("/opportunities");
      setOpportunities(res.data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/opportunities", {
        title,
        status,
        value: parseFloat(value),
      });
      setOpportunities((prev) => [...prev, res.data]);
      setTitle("");
      setStatus("Prospecting");
      setValue("");
    } catch (err) {
      console.error("Error adding opportunity:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/opportunities/${id}`);
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    } catch (err) {
      console.error("Error deleting opportunity:", err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`/opportunities/${id}`, {
        title: editForm.title,
        status: editForm.status,
        value: parseFloat(editForm.value),
      });
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? res.data : opp))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating opportunity:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Opportunities</h2>
      <form onSubmit={handleAdd} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Opportunity Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Prospecting">Prospecting</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Opportunity
        </button>
      </form>

      <ul className="space-y-2">
        {opportunities.map((opp) => (
          <li
            key={opp.id}
            className="p-4 bg-white border shadow-sm rounded-md"
          >
            {editingId === opp.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-1 border"
                />
                <input
                  type="number"
                  value={editForm.value}
                  onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                  className="w-full p-1 border"
                />
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full p-1 border"
                >
                  <option value="Prospecting">Prospecting</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleEditSave(opp.id)}
                  className="text-green-600 mr-4"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{opp.title}</p>
                  <p className="text-gray-600">Status: {opp.status}</p>
                  <p className="text-gray-500">Value: ${opp.value}</p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setEditingId(opp.id);
                      setEditForm({
                        title: opp.title,
                        status: opp.status,
                        value: opp.value,
                      });
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Opportunities;
