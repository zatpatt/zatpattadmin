//src\pages\Admin\DarkStore\PickingPackingPage.jsx
import React, { useState } from "react";

const initialOrders = [
  { id: "GROC101", items: 6, status: "Pending" },
  { id: "GROC102", items: 3, status: "Picking" },
  { id: "GROC103", items: 5, status: "Packed" },
];

export default function PickingPackingPage() {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = (id, status) => {
    setOrders(o =>
      o.map(ord => ord.id === id ? { ...ord, status } : ord)
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Picking & Packing Queue</h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Items</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.items}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2 space-x-2">
                {o.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(o.id, "Picking")}
                    className="text-orange-600"
                  >
                    Start Pick
                  </button>
                )}
                {o.status === "Picking" && (
                  <button
                    onClick={() => updateStatus(o.id, "Packed")}
                    className="text-blue-600"
                  >
                    Pack
                  </button>
                )}
                {o.status === "Packed" && (
                  <button
                    onClick={() => updateStatus(o.id, "Ready")}
                    className="text-green-600"
                  >
                    Ready
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
