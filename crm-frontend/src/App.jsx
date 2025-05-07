// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Opportunities from "./pages/Opportunities";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Campaigns from "./pages/Campaigns";
import MonthlyRevenue from "./pages/MonthlyRevenue";
import Layout from "./components/Layout";
import SalesAnalytics from "./pages/SalesAnalytics";
import EmailTemplates from "./pages/EmailTemplates";
import { useAuth } from "./context/AuthContext";
// import CampaignAnalyticsWrapper from "./pages/CampaignAnalyticsWrapper";
import CampaignAnalytics from "./pages/CampaignAnalytics"; // or adjust the path
import Tasks from "./pages/Tasks";
import InvoiceList from "./pages/InvoiceList";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";
import InvoiceView from "./pages/InvoiceView";


function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Contacts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <Leads />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Layout>
                  <Opportunities />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <Layout>
                  <Campaigns />
                </Layout>
              </ProtectedRoute>
            }
          />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/campaign-analytics/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CampaignAnalytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/email-templates" element={<EmailTemplates />} />

        // Inside Routes
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        
// Add this route
<Route path="/invoices/edit/:id" element={<EditInvoice />} />

<Route
  path="/invoices/view/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <InvoiceView />
      </Layout>
    </ProtectedRoute>
  }
/>

          <Route
            path="/sales-analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <SalesAnalytics />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics/monthly-revenue"
            element={
              <ProtectedRoute>
                <Layout>
                  <MonthlyRevenue />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route  
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
        

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
