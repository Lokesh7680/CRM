import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InvoiceChart from "../components/InvoiceChart";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    winRate: 0,
    avgDaysToClose: 0,
  });
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/invoices/stats");
        const {
          total,
          paid,
          pending,
          overdue,
          totalRevenue,
          winRate,
          avgDaysToClose,
        } = res.data;

        setSummary({ total, paid, pending, overdue, winRate, avgDaysToClose });
        setRevenue(totalRevenue);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      }
    };

    fetchStats();
  }, []);

  const statCard = (title, value, color) => (
    <div
      className={`bg-white border-l-4 ${color} rounded-xl shadow p-5 hover:shadow-lg transition`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="bg-[#F4F6F9] min-h-screen pl-64 pt-20 pr-6 pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back,{" "}
          <span className="text-blue-600">{user?.name || "User"}</span> 👋
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Role: <span className="font-medium">{user?.role?.toUpperCase()}</span>
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {statCard("Total Invoices", summary.total, "border-blue-500")}
        {statCard("Total Revenue", `₹${revenue.toFixed(2)}`, "border-green-500")}
        {statCard("Pending Invoices", summary.pending, "border-yellow-400")}
        {statCard("Overdue Invoices", summary.overdue, "border-red-500")}
        {statCard("Paid Invoices", summary.paid, "border-gray-400")}
        <div className="bg-white border-l-4 border-indigo-500 rounded-xl shadow p-5 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Sales Metrics</p>
          <p className="text-lg font-bold mt-2">
            Win Rate:{" "}
            <span className="text-indigo-600">
              {summary.winRate || "N/A"}%
            </span>
          </p>
          <p className="text-lg font-bold mt-1">
            Avg. Days to Close:{" "}
            <span className="text-indigo-600">
              {summary.avgDaysToClose || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-12 bg-white rounded-xl border border-gray-200 shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Invoice Status Overview
        </h2>
        <InvoiceChart />
      </div>
    </div>
  );
};

export default Dashboard;
  