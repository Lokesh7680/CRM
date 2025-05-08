// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Opportunities from "./pages/Opportunities";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Campaigns from "./pages/Campaigns";
import MonthlyRevenue from "./pages/MonthlyRevenue";
import SalesAnalytics from "./pages/SalesAnalytics";
import EmailTemplates from "./pages/EmailTemplates";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import Tasks from "./pages/Tasks";
import InvoiceList from "./pages/InvoiceList";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";
import InvoiceView from "./pages/InvoiceView";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./context/AuthContext";
import LeadsAnalytics from "./pages/LeadsAnalytics";
import OpportunitiesAnalytics from "./pages/OpportunitiesAnalytics";
import OpportunitiesBoard from "./pages/OpportunitiesBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><AppLayout><Contacts /></AppLayout></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><AppLayout><Leads /></AppLayout></ProtectedRoute>} />
        <Route path="/leads-analytics" element={<ProtectedRoute><AppLayout><LeadsAnalytics /></AppLayout></ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute><AppLayout><Opportunities /></AppLayout></ProtectedRoute>} />
        <Route path="/opportunities-analytics" element={<ProtectedRoute><AppLayout><OpportunitiesAnalytics /></AppLayout></ProtectedRoute>} />
        <Route path="/opportunities-board" element={<ProtectedRoute><AppLayout><OpportunitiesBoard /></AppLayout></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><AppLayout><Sales /></AppLayout></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute><AppLayout><Campaigns /></AppLayout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>} />
        <Route path="/campaign-analytics/:id" element={<ProtectedRoute><AppLayout><CampaignAnalytics /></AppLayout></ProtectedRoute>} />
        <Route path="/email-templates" element={<ProtectedRoute><AppLayout><EmailTemplates /></AppLayout></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><AppLayout><InvoiceList /></AppLayout></ProtectedRoute>} />
        <Route path="/invoices/create" element={<ProtectedRoute><AppLayout><CreateInvoice /></AppLayout></ProtectedRoute>} />
        <Route path="/invoices/edit/:id" element={<ProtectedRoute><AppLayout><EditInvoice /></AppLayout></ProtectedRoute>} />
        <Route path="/invoices/view/:id" element={<ProtectedRoute><AppLayout><InvoiceView /></AppLayout></ProtectedRoute>} />
        <Route path="/sales-analytics" element={<ProtectedRoute><AppLayout><SalesAnalytics /></AppLayout></ProtectedRoute>} />
        <Route path="/analytics/monthly-revenue" element={<ProtectedRoute><AppLayout><MonthlyRevenue /></AppLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
