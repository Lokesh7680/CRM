// src/pages/MonthlyRevenue.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyRevenue = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthly = async () => {
      const res = await axios.get("/opportunities/analytics/monthly-revenue");
      setData(
        res.data.map((entry) => ({
          month: new Date(entry.month).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          revenue: parseFloat(entry.revenue),
        }))
      );
    };
    fetchMonthly();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Revenue (Closed Won)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenue;
