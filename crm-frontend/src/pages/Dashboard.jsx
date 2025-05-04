import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name} 👋</h1>
      <p>Your role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
