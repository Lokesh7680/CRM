// src/pages/LeadsAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LeadsAnalytics = () => {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  const sourceOptions = [
    "Website", "Social Media", "Email Campaigns", "Referrals",
    "Paid Ads", "Events", "Cold Calls/Emails", "Organic Search"
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("/leads");
        setLeads(res.data);
      } catch (err) {
        console.error("Error fetching leads", err);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Leads Analytics</h2>
        <Button variant="outline" onClick={() => navigate("/leads")}>⬅ Back to Leads</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart: Status Distribution */}
        <div className="bg-white p-4 rounded-xl shadow min-h-[320px]">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
                data={[
                { name: "New", value: leads.filter(l => l.status === "New").length },
                { name: "Contacted", value: leads.filter(l => l.status === "Contacted").length },
                { name: "Qualified", value: leads.filter(l => l.status === "Qualified").length }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ value }) => value > 0 ? `${value}` : ""}
                stroke="#fff"
                strokeWidth={2}
            >
                <Cell fill="#facc15" />
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
            </Pie>
            <ReTooltip formatter={(value, name) => [`${value}`, `${name}`]} />
            </PieChart>

          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Leads by Source */}
        <div className="bg-white p-4 rounded-xl shadow min-h-[320px]">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={sourceOptions.map(source => ({
                source,
                count: leads.filter(l => l.source === source).length
                }))}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="source" type="category" width={120} />
                <ReTooltip />
                <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
            </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
};

export default LeadsAnalytics;