import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F4F6F9] text-gray-900">
      {/* Sidebar */}
      <section className="navigation fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 shadow-md z-50">
        <Sidebar />
      </section>

      {/* Main Area */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <section className="site-navigation fixed top-0 left-64 right-0 h-16 bg-[#0176D3] text-white shadow-md z-40">
          <Topbar />
        </section>

        {/* Main Content */}
        <section className="content pt-20 px-6 pb-8">
          {children}
        </section>
      </div>
    </div>
  );
};

export default AppLayout;