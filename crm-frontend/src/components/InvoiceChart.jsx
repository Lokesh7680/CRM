// src/components/InvoiceChart.jsx
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "../api/axios";

const COLORS = ["#34D399", "#FBBF24", "#F87171"];

const InvoiceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/invoices");
        const invoices = res.data;

        const paid = invoices.filter((i) => i.status?.toUpperCase() === "PAID").length;
        const pending = invoices.filter((i) => i.status?.toUpperCase() === "PENDING").length;
        const overdue = invoices.filter((i) => i.status?.toUpperCase() === "OVERDUE").length;
        
        setData([
          { name: "Paid", value: paid },
          { name: "Pending", value: pending },
          { name: "Overdue", value: overdue },
        ]);
      } catch (err) {
        console.error("Error fetching chart data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Invoice Status Distribution</h3>
      <PieChart width={360} height={300}>
        <Pie
          data={data}
          cx={180}
          cy={150}
          innerRadius={50}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default InvoiceChart;
