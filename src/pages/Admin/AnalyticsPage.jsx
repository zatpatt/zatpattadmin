// src/pages/Admin/AnalyticsPage.jsx
import React, { useState } from "react";
import { BarChart2, FileText, ClipboardList, Download } from "lucide-react";
import ReportsPage from "./ReportsPage";
import LogsPage from "./LogsPage";

const sections = [
  {
    name: "📈 Reports & Analytics",
    icon: <FileText size={18} />,
    component: <ReportsPage />,
  },
  {
    name: "📝 Logs",
    icon: <ClipboardList size={18} />,
    component: <LogsPage />,
  },
];

export default function AnalyticsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Analytics & Monitoring</h1>

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
            <div
              className={`transition-[max-height,padding] duration-300 ease-in-out overflow-auto ${
                isOpen ? "max-h-screen p-6" : "max-h-0 p-0"
              }`}
            >
              {isOpen && section.component}
            </div>
          </div>
        );
      })}
    </div>
  );
}
