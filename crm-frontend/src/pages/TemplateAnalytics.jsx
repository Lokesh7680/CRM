// src/pages/TemplateAnalytics.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TemplateAnalytics = () => {
  const { id: templateId } = useParams();
  const [analytics, setAnalytics] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/analytics/template/${templateId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    if (templateId) {
      fetchAnalytics();
    }
  }, [templateId]);

  const pieData = [
    { name: "Sent", value: analytics.sent },
    { name: "Opened", value: analytics.opened },
    { name: "Clicked", value: analytics.clicked },
    { name: "Failed", value: analytics.failed },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Template Analytics</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Engagement Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemplateAnalytics;
