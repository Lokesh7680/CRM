// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const Reports = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("/leads");
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    };
    fetchLeads();
  }, []);

  const leadsByStatus = () => {
    const counts = {};
    leads.forEach((lead) => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({ name: status, value }));
  };

  const leadsBySource = () => {
    const counts = {};
    leads.forEach((lead) => {
      const source = lead.source || "Unknown";
      counts[source] = (counts[source] || 0) + 1;
    });
    return Object.entries(counts).map(([source, value]) => ({ name: source, value }));
  };

  const leadsOverTime = () => {
    const counts = {};
    leads.forEach((lead) => {
      const date = new Date(lead.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, value]) => ({ date, value }));
  };

  return (
    <div className="p-6 space-y-12">
      <h2 className="text-2xl font-bold mb-6">Lead Reports</h2>

      <div>
        <h3 className="text-xl font-semibold mb-2">Leads by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={leadsByStatus()}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {leadsByStatus().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Leads by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={leadsBySource()}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d">
              {leadsBySource().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Leads Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leadsOverTime()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
