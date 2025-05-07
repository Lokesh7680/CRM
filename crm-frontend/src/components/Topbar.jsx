import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, UserCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const Dropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-white hover:underline text-sm font-medium"
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow rounded text-sm w-48 z-50 text-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <section className="site-navigation fixed top-0 left-64 right-0 h-16 bg-[#0176D3] text-white flex items-center justify-between px-6 shadow-md z-40">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center hover:text-gray-100"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/contacts" className="hover:underline">Contacts</a>
          <a href="/leads" className="hover:underline">Leads</a>
          <a href="/opportunities" className="hover:underline">Opportunities</a>

          <Dropdown label="Sales">
            <a href="/sales" className="block px-4 py-2 hover:bg-gray-100">Sales</a>
            <a href="/invoices" className="block px-4 py-2 hover:bg-gray-100">Invoices</a>
            <a href="/sales-analytics" className="block px-4 py-2 hover:bg-gray-100">Sales Analytics</a>
            <a href="/analytics/monthly-revenue" className="block px-4 py-2 hover:bg-gray-100">Monthly Revenue</a>
          </Dropdown>

          <Dropdown label="Marketing">
            <a href="/campaigns" className="block px-4 py-2 hover:bg-gray-100">Campaigns</a>
            <a href="/email-templates" className="block px-4 py-2 hover:bg-gray-100">Email Templates</a>
          </Dropdown>

          <Dropdown label="Productivity">
            <a href="/tasks" className="block px-4 py-2 hover:bg-gray-100">Tasks</a>
            <a href="/reports" className="block px-4 py-2 hover:bg-gray-100">Reports</a>
          </Dropdown>
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded text-sm text-black"
        />
        <Bell size={18} />
        <UserCircle size={20} />
        <button className="bg-white text-[#0176D3] px-3 py-1 rounded text-xs font-semibold">
          Buy Now
        </button>
        <span className="bg-yellow-300 text-black px-2 py-1 rounded text-xs">30 days left</span>
      </div>
    </section>
  );
};

export default Topbar;