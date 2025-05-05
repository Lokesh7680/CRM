import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-gray-900 text-white p-4 fixed transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${collapsed ? "hidden" : "block"}`}>CRM</h2>
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="space-y-4">
        <Link to="/dashboard" className="flex items-center gap-3 hover:text-yellow-300">
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </Link>
        <Link to="/contacts" className="flex items-center gap-3 hover:text-yellow-300">
          <Users size={18} />
          {!collapsed && "Contacts"}
        </Link>
        <Link to="/leads" className="flex items-center gap-3 hover:text-yellow-300">
          <ClipboardList size={18} />
          {!collapsed && "Leads"}
        </Link>
        <Link to="/opportunities" className="flex items-center gap-3 hover:text-yellow-300">
          <ClipboardList size={18} />
          {!collapsed && "Opportunities"}
        </Link>
        <Link to="/sales" className="flex items-center gap-3 hover:text-yellow-300">
          <ShoppingCart size={18} />
          {!collapsed && "Sales"}
        </Link>
        <Link to="/campaigns" className="flex items-center gap-3 hover:text-yellow-300">
          <ClipboardList size={18} />
          {!collapsed && "Campaigns"}
        </Link>
        <Link to="/campaign-analytics/cmaax628h00018u91ebxvfuic">Campaign Analytics</Link>
        <Link to="/email-templates" className="flex items-center gap-3 hover:text-yellow-300">
          <ClipboardList size={18} />
          {!collapsed && "Email Templates"}
        </Link>
        <Link to="/reports" className="flex items-center gap-3 hover:text-yellow-300">
          <BarChart2 size={18} />
          {!collapsed && "Reports"}
        </Link>
        <Link to="/sales-analytics" className="flex items-center gap-3 hover:text-yellow-300">
          <BarChart2 size={18} />
          {!collapsed && "Sales Analytics"}
        </Link>
        <Link to="/analytics/monthly-revenue" className="flex items-center gap-3 hover:text-yellow-300">
          <BarChart2 size={18} />
          {!collapsed && "Monthly Revenue"}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 hover:text-red-400 mt-6"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
