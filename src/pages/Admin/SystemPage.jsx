// src/pages/Admin/SystemPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Globe,
  Image,
  Bell,
  Shield,
  Key,
} from "lucide-react";

import SettingsPage from "./SettingsPage";
import GeoZonesPage from "./GeoZonesPage";
import BannersPage from "./BannersPage";
import NotificationsPage from "./NotificationsPage";
// import RolesAndSecurityPage from "./RolesAndSecurityPage";
// import DeveloperSettingsPage from "./DeveloperSettingsPage";

const sections = [
  { name: "⚙️ Settings", icon: <Settings size={18} />, component: <SettingsPage /> },
  { name: "🌐 Geo Zones", icon: <Globe size={18} />, component: <GeoZonesPage /> },
  { name: "🖼️ Banners", icon: <Image size={18} />, component: <BannersPage /> },
  { name: "🔔 Notifications", icon: <Bell size={18} />, component: <NotificationsPage /> },
  // { name: "🔐 Roles & Security", icon: <Shield size={18} />, component: <RolesAndSecurityPage /> },
  // { name: "🛠️ Developer / System Settings", icon: <Key size={18} />, component: <DeveloperSettingsPage /> },
];

export default function SystemPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">App Configuration / System</h1>

      {sections.map((section, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div key={section.name} className="bg-white rounded-2xl shadow">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-orange-50 rounded-t-2xl"
            >
              <div className="flex items-center gap-2 font-medium text-gray-700">
                {section.icon} {section.name}
              </div>
              <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Section Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-6"
                >
                  <div className="py-4">{section.component}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
