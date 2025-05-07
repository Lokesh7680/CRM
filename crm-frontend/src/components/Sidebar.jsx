import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ShoppingCart,
  FileText,
  PieChart,
  Mail,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navItem = (to, label, Icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 ${
          isActive ? "text-blue-700 font-semibold bg-blue-100" : "text-blue-600"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <section className="navigation w-64 min-h-screen bg-white border-r border-gray-200 p-4 space-y-6">
      <div>
        <p className="text-xs text-gray-500 uppercase mb-2">Main</p>
        <div className="space-y-1">
          {navItem("/dashboard", "Dashboard", LayoutDashboard)}
          {navItem("/contacts", "Contacts", Users)}
          {navItem("/leads", "Leads", ClipboardList)}
          {navItem("/opportunities", "Opportunities", ClipboardList)}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase mb-2">Sales</p>
        <div className="space-y-1">
          {navItem("/sales", "Sales", ShoppingCart)}
          {navItem("/invoices", "Invoices", FileText)}
          {navItem("/sales-analytics", "Sales Analytics", PieChart)}
          {navItem("/analytics/monthly-revenue", "Monthly Revenue", PieChart)}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase mb-2">Marketing</p>
        <div className="space-y-1">
          {navItem("/campaigns", "Campaigns", ClipboardList)}
          {navItem("/email-templates", "Email Templates", Mail)}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase mb-2">Productivity</p>
        <div className="space-y-1">
          {navItem("/tasks", "Tasks", ClipboardList)}
          {navItem("/reports", "Reports", BarChart2)}
        </div>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="space-y-1">
          {navItem("/settings", "Settings", Settings)}
          {navItem("/logout", "Logout", LogOut)}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;