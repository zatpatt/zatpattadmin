// src/pages/Admin/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content */}
        <div className="p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
