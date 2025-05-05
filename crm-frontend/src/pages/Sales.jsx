// src/pages/Sales.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

const Sales = () => {
  const [closedWon, setClosedWon] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get("/opportunities");
        const filtered = res.data.filter((opp) => opp.status === "Closed Won");
        setClosedWon(filtered);
        computeMonthlyRevenue(filtered);
      } catch (err) {
        toast.error("Failed to load sales data");
      }
    };

    const computeMonthlyRevenue = (opps) => {
      const revenueMap = {};

      opps.forEach((opp) => {
        if (!opp.closeDate) return;
        const month = dayjs(opp.closeDate).format("MMM YYYY");
        revenueMap[month] = (revenueMap[month] || 0) + (opp.value || 0);
      });

      const result = Object.entries(revenueMap).map(([month, value]) => ({
        month,
        revenue: value,
      }));

      setMonthlyRevenue(result);
    };

    fetchOpportunities();
  }, []);

  const totalRevenue = closedWon.reduce((sum, opp) => sum + (opp.value || 0), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Module</h2>

      <div className="mb-6 text-lg font-medium">
        Total Revenue from Closed Won Deals:{" "}
        <span className="text-green-600">${totalRevenue.toLocaleString()}</span>
      </div>

      <h3 className="text-xl font-semibold mb-2">Monthly Revenue</h3>
      {monthlyRevenue.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No revenue data available for chart.</p>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-4">Closed Won Deals</h3>
      <ul className="space-y-4">
        {closedWon.map((opp) => (
          <li key={opp.id} className="border p-4 rounded shadow">
            <p className="font-semibold">{opp.title}</p>
            <p className="text-sm text-gray-500">Value: ${opp.value}</p>
            <p className="text-sm text-gray-500">
              Closed On: {opp.closeDate?.split("T")[0] || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
