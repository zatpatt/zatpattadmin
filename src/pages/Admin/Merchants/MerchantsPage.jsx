// src/pages/Admin/MerchantsPage.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "admin_merchants_v2";

// Sample merchants
const SAMPLE_MERCHANTS = [
  {
    id: "m_1",
    name: "Spicy Bites",
    owner: "Rahul Sharma",
    phone: "9876543210",
    status: "active",
    blocked: false,
    commission: 10,
    earnings: 12000,
    gst: "27AAAPL1234C1Z2",
    fssai: "12345678901234",
    pan: "AAAPL1234C",
    shopImages: [
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&h=100&w=100",
    ],
  },
  {
    id: "m_2",
    name: "Sweet Tooth",
    owner: "Sneha Kapoor",
    phone: "9123456780",
    status: "pending",
    blocked: false,
    commission: 12,
    earnings: 8000,
    gst: "27BBAPL5678C1Z3",
    fssai: "56789012345678",
    pan: "BBAPL5678C",
    shopImages: [
      "https://images.unsplash.com/photo-1598514982475-947021345c77?crop=entropy&cs=tinysrgb&fit=max&h=100&w=100",
    ],
  },
  {
    id: "m_3",
    name: "Healthy Greens",
    owner: "Amit Verma",
    phone: "9988776655",
    status: "active",
    blocked: true,
    commission: 15,
    earnings: 15000,
    gst: "27CCAPL9012C1Z4",
    fssai: "90123456789012",
    pan: "CCAPL9012C",
    shopImages: [],
  },
];

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!stored || stored.length === 0) {
      setMerchants(SAMPLE_MERCHANTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MERCHANTS));
    } else {
      setMerchants(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
  }, [merchants]);

  const approve = (id) =>
    setMerchants(
      merchants.map((m) => (m.id === id ? { ...m, status: "active" } : m))
    );

  const reject = (id) =>
    setMerchants(
      merchants.map((m) => (m.id === id ? { ...m, status: "rejected" } : m))
    );

  const toggleBlock = (id) =>
    setMerchants(
      merchants.map((m) => (m.id === id ? { ...m, blocked: !m.blocked } : m))
    );

  const setCommission = (id) => {
    const c = prompt("Enter commission % (number):");
    if (!c) return;
    setMerchants(
      merchants.map((m) => (m.id === id ? { ...m, commission: Number(c) } : m))
    );
  };

  const viewKYC = (m) =>
    alert(
      `GST: ${m.gst || "N/A"}\nFSSAI: ${m.fssai || "N/A"}\nPAN: ${
        m.pan || "N/A"
      }`
    );

  const getProfileImage = (m) =>
    m.shopImages?.length
      ? m.shopImages[0]
      : "https://via.placeholder.com/40?text=👤";

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🏪 Merchants</h2>
        <div className="flex gap-2">
          <button
            onClick={() => (window.location.href = "/admin/merchants/add")}
            className="bg-amber-400 px-3 py-2 rounded text-white"
          >
            Add Merchant
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              location.reload();
            }}
            className="bg-red-400 px-3 py-2 rounded text-white"
          >
            Reset Sample
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Store</th>
              <th className="p-3 text-center">Owner</th>
              <th className="p-3 text-center">Phone</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Blocked</th>
              <th className="p-3 text-center">Commission</th>
              <th className="p-3 text-center">Earnings</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={getProfileImage(m)}
                    alt="store"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.id}</div>
                  </div>
                </td>
                <td className="p-3 text-center">{m.owner}</td>
                <td className="p-3 text-center">{m.phone}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      m.status === "active"
                        ? "bg-green-100 text-green-700"
                        : m.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="p-3 text-center">{m.blocked ? "Yes" : "No"}</td>
                <td className="p-3 text-center">{m.commission}%</td>
                <td className="p-3 text-center">₹{m.earnings}</td>
                <td className="p-3 text-center flex flex-wrap gap-1 justify-center">
                  <button
                    onClick={() => (window.location.href = `/admin/merchant/${m.id}`)}
                    className="px-2 py-1 rounded bg-orange-500 text-white text-xs"
                  >
                    View
                  </button>
                  {m.status === "pending" && (
                    <button
                      onClick={() => approve(m.id)}
                      className="px-2 py-1 rounded bg-green-500 text-white text-xs"
                    >
                      Approve
                    </button>
                  )}
                  {m.status === "pending" && (
                    <button
                      onClick={() => reject(m.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white text-xs"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => setCommission(m.id)}
                    className="px-2 py-1 rounded bg-amber-400 text-white text-xs"
                  >
                    Commission
                  </button>
                  <button
                    onClick={() => toggleBlock(m.id)}
                    className="px-2 py-1 rounded bg-gray-200 text-red-600 text-xs"
                  >
                    {m.blocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => viewKYC(m)}
                    className="px-2 py-1 rounded bg-blue-500 text-white text-xs"
                  >
                    KYC
                  </button>
                </td>
              </tr>
            ))}
            {merchants.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No merchants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
