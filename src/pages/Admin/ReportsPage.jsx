// src/pages/Admin/ReportsPage.jsx
import React, { useState } from "react";
import { FileText, BarChart2, User, Users, Award, Download } from "lucide-react";

const dummySales = [
  { date: "2025-11-18", total: 4200 },
  { date: "2025-11-19", total: 5100 },
  { date: "2025-11-20", total: 3800 },
];

const dummyMerchants = [
  { id: 1, name: "Cafe Coffee Day", earnings: 12000 },
  { id: 2, name: "Burger King", earnings: 15500 },
];

const dummyDelivery = [
  { id: 1, name: "Rahul", completed: 24, rating: 4.5 },
  { id: 2, name: "Priya", completed: 18, rating: 4.7 },
];

const dummyTopItems = [
  { name: "Cold Coffee", sold: 120 },
  { name: "Veg Sandwich", sold: 90 },
];

export default function ReportsPage() {
  const [format, setFormat] = useState("excel");

  const handleDownload = () => {
    alert(`Downloading report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>

      {/* Sales Report */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-orange-500" />
          <div className="font-semibold">Daily Earnings Report</div>
        </div>
        <div className="space-y-2">
          {dummySales.map((s, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <div>{s.date}</div>
              <div>₹{s.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Merchant Earnings */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-green-500" />
          <div className="font-semibold">Merchant Earnings</div>
        </div>
        <div className="space-y-2">
          {dummyMerchants.map((m) => (
            <div key={m.id} className="flex justify-between border-b py-1">
              <div>{m.name}</div>
              <div>₹{m.earnings}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Partner Performance */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-blue-500" />
          <div className="font-semibold">Delivery Partner Performance</div>
        </div>
        <div className="space-y-2">
          {dummyDelivery.map((d) => (
            <div key={d.id} className="flex justify-between border-b py-1">
              <div>{d.name}</div>
              <div>
                Completed: {d.completed}, Rating: {d.rating}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <Award size={18} className="text-purple-500" />
          <div className="font-semibold">Top Items</div>
        </div>
        <div className="space-y-2">
          {dummyTopItems.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <div>{item.name}</div>
              <div>Sold: {item.sold}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white p-4 rounded-2xl shadow flex items-center gap-3">
        <BarChart2 size={18} className="text-orange-500" />
        <div className="flex-1">Download Reports</div>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border rounded-lg px-2 py-1"
        >
          <option value="excel">Excel</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
        <button
          onClick={handleDownload}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-1"
        >
          <Download size={16} /> Download
        </button>
      </div>

      {/* Placeholder for future analytics like fraud, app usage, heatmap */}
      <div className="bg-white p-4 rounded-2xl shadow text-gray-500 text-center">
        App Usage Analytics / Fraud Detection / Heatmap (Coming Soon)
      </div>
    </div>
  );
}
