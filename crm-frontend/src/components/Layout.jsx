// src/components/Layout.jsx
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
