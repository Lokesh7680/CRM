// src/pages/RevenueAnalytics.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("/opportunities/analytics/revenue");
        setData([
          {
            status: "Closed Won",
            revenue: res.data[0]?._sum?.value || 0,
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch revenue data", err);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAnalytics;
