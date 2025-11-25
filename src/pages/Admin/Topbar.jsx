// src/pages/Admin/Topbar.jsx
import React from "react";
import { Menu } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white p-4 shadow flex items-center justify-between">
      
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-orange-600 transition"
      >
        <Menu size={24} />
      </button>

      <div className="text-lg font-semibold">Admin Dashboard</div>

      <div className="flex items-center gap-3">
        <span className="bg-white text-orange-600 px-3 py-1 rounded-full font-medium">
          Admin
        </span>
      </div>
    </div>
  );
}
