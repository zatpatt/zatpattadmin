// src/pages/Admin/DarkStore/DarkStoresPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_STORES = [
  {
    id: "DS001",
    name: "Zatpatt Dark Store - Andheri",
    city: "Mumbai",
    pincodeCount: 12,
    status: "Active",
    capacity: "High",
  },
  {
    id: "DS002",
    name: "Zatpatt Dark Store - Thane",
    city: "Thane",
    pincodeCount: 8,
    status: "Active",
    capacity: "Medium",
  },
];

export default function DarkStoresPage() {
  const [stores] = useState(MOCK_STORES);
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dark Stores</h1>
        <button
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold shadow"
          onClick={() => alert("In future: open Add Dark Store form")}
        >
          + Add Dark Store
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Store ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">City</th>
              <th className="py-2">Pincodes</th>
              <th className="py-2">Capacity</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-b last:border-none">
                <td className="py-2">{store.id}</td>
                <td className="py-2">{store.name}</td>
                <td className="py-2">{store.city}</td>
                <td className="py-2">{store.pincodeCount}</td>
                <td className="py-2">{store.capacity}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      store.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {store.status}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button
                    className="text-orange-600 text-xs font-medium"
                    onClick={() => navigate(`/admin/dark-stores/${store.id}`)}
                  >
                    View / Edit →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stores.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">
            No dark stores yet. Click "Add Dark Store" to create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
