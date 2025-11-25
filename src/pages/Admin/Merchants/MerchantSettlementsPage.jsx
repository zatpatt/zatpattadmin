// src/pages/Admin/MerchantSettlementsPage.jsx
import React, { useEffect, useState } from "react";

const SET_KEY = "admin_settlements_v2";
const MER_KEY = "admin_merchants_v2";

export default function MerchantSettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    setMerchants(JSON.parse(localStorage.getItem(MER_KEY) || "[]"));
    setSettlements(JSON.parse(localStorage.getItem(SET_KEY) || "[]"));
  }, []);

  useEffect(() => localStorage.setItem(SET_KEY, JSON.stringify(settlements)), [settlements]);

  const requestPayout = merchantId => {
    const m = merchants.find(x => x.id === merchantId);
    if (!m) return alert("merchant not found");
    const rec = { id: "sett_" + Date.now(), merchantId, amount: Math.round(m.earnings * 0.8), status: "requested", createdAt: new Date().toISOString() };
    setSettlements([rec, ...settlements]);
    alert("Payout requested (demo)");
  };

  const markPaid = id => setSettlements(settlements.map(s => s.id === id ? { ...s, status: "paid" } : s));

  const downloadPDF = merchant => {
    alert(`Mock PDF statement for ${merchant.name}\nEarnings: ₹${merchant.earnings}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">🏦 Settlements & Payouts</h2>

      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="mb-3 text-sm text-gray-600">Request manual payouts to merchants.</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {merchants.map(m => (
            <div key={m.id} className="p-3 border rounded">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-500">Earnings: ₹{m.earnings}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => requestPayout(m.id)} className="bg-orange-500 text-white px-2 py-1 rounded text-sm">Request Payout</button>
                <button onClick={() => downloadPDF(m)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">PDF Statement</button>
              </div>
            </div>
          ))}
          {!merchants.length && <div className="text-gray-400 p-4">No merchants</div>}
        </div>

        <div className="bg-white mt-4 p-4 rounded-2xl shadow">
          <h4 className="font-semibold mb-2">Payout Requests</h4>
          {settlements.length ? settlements.map(s => (
            <div key={s.id} className="flex justify-between items-center border-b py-2">
              <div>
                <div className="font-medium">{s.id}</div>
                <div className="text-sm text-gray-500">{s.merchantId} • ₹{s.amount}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-sm">{s.status}</div>
                {s.status !== "paid" && <button onClick={() => markPaid(s.id)} className="px-2 py-1 rounded bg-green-500 text-white text-xs">Mark Paid</button>}
              </div>
            </div>
          )) : <p className="text-gray-400">No payout requests.</p>}
        </div>
      </div>
    </div>
  );
}
