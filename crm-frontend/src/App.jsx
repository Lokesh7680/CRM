// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import toastify styles

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Opportunities from "./pages/Opportunities";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <>
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

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

        {/* 👇 Add this toast container outside the Routes so it renders globally */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </>
    </Router>
  );
}

export default App;
