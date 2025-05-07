// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="pt-20 px-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
