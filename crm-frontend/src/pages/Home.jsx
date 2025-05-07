import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

const Home = () => {
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsRes = await axios.get("/leads");
        const contactsRes = await axios.get("/contacts");
        const opportunitiesRes = await axios.get("/opportunities");
        const revenueRes = await axios.get("/analytics/monthly-revenue");

        setLeads(leadsRes.data);
        setContacts(contactsRes.data);
        setOpportunities(opportunitiesRes.data);
        setMonthlyRevenue(revenueRes.data);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchData();
  }, []);

  const getStageCounts = () => {
    const stageMap = {};
    opportunities.forEach((opp) => {
      const key = opp.status || "Unknown";
      stageMap[key] = (stageMap[key] || 0) + 1;
    });
    return Object.entries(stageMap).map(([status, value]) => ({ status, value }));
  };

  return (
    <div className="bg-[#F4F6F9] min-h-screen">
      {/* Sidebar Navigation */}
      <section className="navigation fixed top-0 left-0 w-16 h-full bg-[#032D60] z-50 shadow-md">
        {/* Sidebar icons go here */}
      </section>

      {/* Topbar Navigation */}
      <section className="site-navigation fixed top-0 left-16 right-0 h-16 bg-[#0176D3] text-white flex items-center justify-between px-6 shadow-md z-40">
        <h1 className="text-xl font-bold tracking-tight">Akshaya CRM</h1>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-1 rounded text-black text-sm w-1/3"
        />
        <div className="flex items-center gap-4">
          <span className="bg-yellow-300 text-black px-2 py-1 rounded text-xs">30 days left</span>
          <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">Buy Now</button>
        </div>
      </section>

      {/* Main Content */}
      <section className="content ml-16 pt-20 px-8 pb-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Overview of your system</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Total Leads</h3>
            <p className="text-3xl font-bold text-blue-700 mt-1">{leads.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
            <h3 className="text-sm text-gray-500">Total Contacts</h3>
            <p className="text-3xl font-bold text-indigo-700 mt-1">{contacts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500">Total Opportunities</h3>
            <p className="text-3xl font-bold text-green-700 mt-1">{opportunities.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opportunities Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Opportunities by Stage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStageCounts()}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0176D3" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;