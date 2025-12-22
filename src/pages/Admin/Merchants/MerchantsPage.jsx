// src/pages/Admin/MerchantsPage.jsx
import React, { useEffect, useState } from "react";
import { getMerchants } from "../../../services/merchantApi";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load merchants from backend
  useEffect(() => {
    const loadMerchants = async () => {
      try {
        setLoading(true);
        const data = await getMerchants();

        const mapped = data.map((m) => ({
          id: String(m.merchant_id),
          name: m.name,
          owner: m.owner_name || "—",
          phone: m.phone || "—",
          status: m.is_active ? "active" : "inactive",
          blocked: m.is_blocked,
          commission: m.commission_value ?? 0,
          earnings: m.total_earning ?? 0,
          gst: m.gst_number || null,
          fssai: m.fssai_number || null,
          pan: m.pan_number || null,
          shopImages: [],
        }));

        setMerchants(mapped);
      } catch (err) {
        console.error(err);
        alert("Failed to load merchants");
      } finally {
        setLoading(false);
      }
    };

    loadMerchants();
  }, []);

  // 🔹 UI-only actions (backend APIs can be added later)
  const approve = (id) =>
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "active" } : m))
    );

  const reject = (id) =>
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "rejected" } : m))
    );

   const getProfileImage = (m) =>
    m.shopImages?.length
      ? m.shopImages[0]
      : "https://via.placeholder.com/40?text=🏪";

  if (loading) {
    return <div className="p-6">Loading merchants...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🏪 Merchants</h2>
        <button
          onClick={() => (window.location.href = "/admin/merchants/add")}
          className="bg-amber-400 px-3 py-2 rounded text-white"
        >
          Add Merchant
        </button>
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
                    <div className="text-xs text-gray-500">
                      ID: {m.id}
                    </div>
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

                <td className="p-3 text-center">
                  {m.blocked ? "Yes" : "No"}
                </td>

                <td className="p-3 text-center">
                  {m.commission}%
                </td>

                <td className="p-3 text-center">
                  ₹{m.earnings}
                </td>

                <td className="p-3 text-center flex flex-wrap gap-1 justify-center">
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/merchant/${m.id}`)
                    }
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
               
                </td>
              </tr>
            ))}

            {merchants.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No merchants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
