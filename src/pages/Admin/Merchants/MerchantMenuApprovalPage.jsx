// src/pages/Admin/MerchantMenuApprovalPage.jsx
import React, { useEffect, useState } from "react";

const KEY = "admin_menu_pending_v1";
const MER_KEY = "admin_merchants_v2";

export default function MerchantMenuApprovalPage() {
  const [list, setList] = useState([]);
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    const loadedList = JSON.parse(localStorage.getItem(KEY) || "[]");
    setList(loadedList);
    const loadedMerchants = JSON.parse(localStorage.getItem(MER_KEY) || "[]");
    setMerchants(loadedMerchants);
  }, []);

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(list)), [list]);

  const approve = id => setList(list.map(i => i.id === id ? { ...i, status: "approved" } : i));
  const reject = id => setList(list.map(i => i.id === id ? { ...i, status: "rejected" } : i));
  const bulkApprove = () => { if (!confirm("Approve all pending items?")) return; setList(list.map(i => i.status === "pending" ? { ...i, status: "approved" } : i)); };
  const bulkReject = () => { if (!confirm("Reject all pending items?")) return; setList(list.map(i => i.status === "pending" ? { ...i, status: "rejected" } : i)); };

  const getMerchantName = id => merchants.find(m => m.id === id)?.name || id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🍔 Menu Approvals</h2>
        <div className="flex gap-2">
          <button onClick={bulkApprove} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Bulk Approve</button>
          <button onClick={bulkReject} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Bulk Reject</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        {list.length ? list.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-3">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">Merchant: {getMerchantName(item.merchantId)} • ₹{item.price} (MRP ₹{item.mrp})</div>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`px-2 py-1 rounded text-xs ${item.status === "pending" ? "bg-yellow-100 text-yellow-700" : item.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {item.status}
              </span>
              {item.status === "pending" && <button onClick={() => approve(item.id)} className="px-2 py-1 rounded bg-green-500 text-white text-xs">Approve</button>}
              {item.status === "pending" && <button onClick={() => reject(item.id)} className="px-2 py-1 rounded bg-red-500 text-white text-xs">Reject</button>}
            </div>
          </div>
        )) : <p className="text-gray-400 p-4">No pending items.</p>}
      </div>
    </div>
  );
}
