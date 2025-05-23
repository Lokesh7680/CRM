import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF4C4C"];

const CampaignAnalytics = () => {
  const { id: campaignId } = useParams(); 
  const [analytics, setAnalytics] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/analytics/campaign/${campaignId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    if (campaignId) {
      fetchAnalytics();
    }
  }, [campaignId]);

  const pieData = [
    { name: "Opened", value: analytics.opened },
    { name: "Clicked", value: analytics.clicked },
    { name: "Failed", value: analytics.failed },
    { name: "Not Opened", value: analytics.sent - analytics.opened },
  ];

  const barData = [
    { name: "Sent", count: analytics.sent },
    { name: "Opened", count: analytics.opened },
    { name: "Clicked", count: analytics.clicked },
    { name: "Failed", count: analytics.failed },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Campaign Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pie Chart Overview</h3>
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Bar Chart Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
