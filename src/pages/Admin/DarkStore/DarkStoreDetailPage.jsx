// src/pages/Admin/DarkStore/DarkStoreDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const MOCK_STORE = {
  id: "DS001",
  name: "Zatpatt Dark Store - Andheri",
  city: "Mumbai",
  address: "Andheri West, Mumbai",
  lat: 19.1197,
  lng: 72.8468,
  capacity: "High",
  status: "Active",
  pincodes: ["400053", "400058", "400061", "400052"],
};

const MOCK_INVENTORY = [
  { sku: "MILK500", name: "Toned Milk 500ml", stock: 120, reorderAt: 40 },
  { sku: "BREAD01", name: "Brown Bread", stock: 35, reorderAt: 20 },
  { sku: "EGG12", name: "Eggs (12 pcs)", stock: 80, reorderAt: 30 },
];

export default function DarkStoreDetailPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const store = MOCK_STORE; // later: fetch by id
  const inventory = MOCK_INVENTORY;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <button
        onClick={() => navigate("/admin/dark-stores")}
        className="text-sm text-gray-600 mb-2"
      >
        ← Back to Dark Stores
      </button>

      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {store.name} <span className="text-gray-400 text-sm">({storeId})</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {store.address} · {store.city}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
              {store.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-gray-500">Capacity</div>
            <div className="text-lg font-semibold">{store.capacity}</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-gray-500">Pincodes Covered</div>
            <div className="text-lg font-semibold">{store.pincodes.length}</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-gray-500">Location (Lat, Lng)</div>
            <div className="text-sm font-mono">
              {store.lat}, {store.lng}
            </div>
          </div>
        </div>
      </div>

      {/* Pincodes list */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pincodes Coverage</h2>
          <button
            className="text-xs text-orange-600 font-medium"
            onClick={() => navigate("/admin/pincodes")}
          >
            Manage All Pincode Mapping →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {store.pincodes.map((p) => (
            <span
              key={p}
              className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Inventory snapshot */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Inventory Snapshot</h2>
          <button
            className="text-xs text-orange-600 font-medium"
          onClick={() => navigate(`/admin/dark-stores/${storeId}/inventory`)}
          >
            Go to Inventory →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">SKU</th>
              <th className="py-2">Item</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Reorder At</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.sku} className="border-b last:border-none">
                <td className="py-2 font-mono">{item.sku}</td>
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.stock}</td>
                <td className="py-2 text-gray-500">{item.reorderAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
