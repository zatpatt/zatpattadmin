// src/pages/Admin/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen }) {
  const { pathname } = useLocation();

  const isCustomerActive = pathname.startsWith("/admin/customers");

  const menu = [
    { name: "📊 Dashboard", path: "/admin" },
    { name: "🛍️ Orders", path: "/admin/orders" },
    { name: "👥 Customers", path: "/admin/customers", active: isCustomerActive },
    { name: "🏪 Merchants", path: "/admin/merchants" },
    { name: "🚴 Delivery Partners", path: "/admin/delivery" },
    { name: "🍔 Menu Moderation", path: "/admin/menu" },
    { name: "💸 Finance", path: "/admin/finance" },
    { name: "🎫 Complaints", path: "/admin/complaints" },
    { name: "🎁 Promotions & Marketing", path: "/admin/promotions" },
    { name: "📈 Analytics & Monitoring", path: "/admin/analytics" },
    { name: "⚙️ App Configuration & System", path: "/admin/system" },
    { name: "🆘 Support & Feedback", path: "/admin/support" },
  ];

  return (
    <div
      className={`bg-white shadow-lg h-full transition-all duration-300 
        ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}
      `}
    >
      <div className="p-5 text-xl font-bold border-b">Admin Panel</div>

      <nav className="mt-4">
        {menu.map((item) => {
          const active = item.active || pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-5 py-3 text-sm font-medium rounded-lg mx-2 mb-1
                ${active ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
