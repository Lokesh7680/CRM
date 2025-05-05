// src/pages/SalesAnalytics.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const SalesAnalytics = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueByStatus, setRevenueByStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyRes, statusRes] = await Promise.all([
          axios.get("/opportunities/analytics/monthly-revenue"),
          axios.get("/opportunities/analytics/revenue"),
        ]);
  
        setMonthlyRevenue(monthlyRes.data);
  
        // ✅ Format the revenueByStatus response to flatten it
        const formattedStatus = statusRes.data.map(item => ({
          status: item.status,
          revenue: item._sum.value || 0,
        }));
        setRevenueByStatus(formattedStatus);
  
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>

      {/* Monthly Revenue Line Chart */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-2">Monthly Revenue</h3>
        {monthlyRevenue.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Total Revenue" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue by Status Bar Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Revenue by Status</h3>
        {revenueByStatus.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;
