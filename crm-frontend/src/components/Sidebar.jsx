// src/components/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">CRM</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:text-yellow-300">Dashboard</Link>
        <Link to="/contacts" className="block hover:text-yellow-300">Contacts</Link>
        <Link to="/leads" className="block hover:text-yellow-300">Leads</Link>
        <Link to="/opportunities" className="block hover:text-yellow-300">Opportunities</Link>
        <button
          onClick={handleLogout}
          className="mt-6 text-left w-full hover:text-red-400"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
