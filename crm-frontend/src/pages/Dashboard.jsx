// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InvoiceChart from "../components/InvoiceChart";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/invoices/stats");
        const { total, paid, pending, overdue, totalRevenue } = res.data;
        setSummary({ total, paid, pending, overdue });
        setRevenue(totalRevenue);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
  
    fetchStats();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="mb-6">Your role: {user?.role}</p>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Total Invoices</h3>
          <p className="text-2xl">{summary.total}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Total Revenue</h3>
          <p className="text-2xl">₹{revenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Pending</h3>
          <p className="text-2xl">{summary.pending}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Overdue</h3>
          <p className="text-2xl">{summary.overdue}</p>
        </div>
        <div className="bg-gray-100 text-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Paid</h3>
          <p className="text-2xl">{summary.paid}</p>
        </div>
      </div>

      {/* Chart */}
      <InvoiceChart />

      <button
        onClick={logout}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
