// src/pages/OpportunitiesAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const OpportunitiesAnalytics = () => {
  const [opps, setOpps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/opportunities");
        setOpps(res.data);
      } catch {
        console.error("Failed to fetch opportunities");
      }
    };
    fetchData();
  }, []);

  const stageCounts = opps.reduce((acc, opp) => {
    acc[opp.status] = (acc[opp.status] || 0) + 1;
    return acc;
  }, {});

  const stageData = Object.entries(stageCounts).map(([name, value]) => ({ name, value }));

  const winLossData = [
    { name: "Closed Won", value: stageCounts["Closed Won"] || 0 },
    { name: "Closed Lost", value: stageCounts["Closed Lost"] || 0 }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Opportunities Analytics</h2>
        <button
          onClick={() => navigate("/opportunities")}
          className="bg-white border px-4 py-2 rounded shadow hover:bg-gray-100"
        >
          ⬅ Back to Opportunities
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Opportunities by Stage</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={stageData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {stageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Win/Loss Breakdown</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={winLossData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label
            >
              {winLossData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesAnalytics;
