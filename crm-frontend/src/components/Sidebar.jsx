// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart,
  Mail,
  ClipboardList,
  FileText,
  DollarSign,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Contacts", icon: Users, path: "/contacts" },
  { name: "Leads", icon: Briefcase, path: "/leads" },
  { name: "Opportunities", icon: DollarSign, path: "/opportunities" },
  { name: "Campaigns", icon: Mail, path: "/campaigns" },
  { name: "Tasks", icon: ClipboardList, path: "/tasks" },
  { name: "Sales Analytics", icon: BarChart, path: "/sales-analytics" },
  { name: "Monthly Revenue", icon: FileText, path: "/monthly-revenue" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md p-4 fixed z-20">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">Akshaya CRM</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            to={path}
            key={name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-800 font-semibold"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
