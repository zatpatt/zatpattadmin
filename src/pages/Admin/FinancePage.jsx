// src/pages/Admin/FinancePage.jsx
import React, { useState } from "react";

// You can copy the inner content of PayoutsPage & RefundsPage here
// without their top-level <div className="max-w-7xl...">

import { Download, FileText, User, Truck } from "lucide-react";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("payouts");

  // ======= Dummy Data =======
  const dummyPayouts = [
    { id: 1, type: "Merchant", name: "Coffee House", amount: 4500, status: "Pending", week: "2025-W45", gstInvoice: false },
    { id: 2, type: "Delivery Partner", name: "Ravi Kumar", amount: 3200, status: "Completed", week: "2025-W45", gstInvoice: true },
    { id: 3, type: "Merchant", name: "Snack Station", amount: 2100, status: "Failed", week: "2025-W46", gstInvoice: false },
  ];

  const dummyRefunds = [
    { id: 101, orderId: 5001, customer: "Rahul Sharma", amount: 420, type: "Full", method: "Wallet", status: "Pending" },
    { id: 102, orderId: 5002, customer: "Priya Singh", amount: 180, type: "Partial", method: "Bank", status: "Completed" },
  ];

  // State
  const [payouts, setPayouts] = useState(dummyPayouts);
  const [refunds, setRefunds] = useState(dummyRefunds);

  // ======= Handlers =======
  const approvePayout = (id) => setPayouts(payouts.map(p => p.id === id ? { ...p, status: "Completed", gstInvoice: true } : p));
  const downloadInvoice = (id) => alert(`Download GST invoice for ID: ${id}`);
  const downloadReport = () => alert("Download full payout report (CSV/Excel)");

  const updateRefundStatus = (id, status) => setRefunds(refunds.map(r => r.id === id ? { ...r, status } : r));

  // ======= Render =======
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Finance</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "payouts" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Payouts
        </button>
        <button
          onClick={() => setActiveTab("refunds")}
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "refunds" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Refunds
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "payouts" && (
        <div>
          {payouts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow flex justify-between items-center mb-3">
              <div>
                <div className="font-medium">
                  {p.type === "Merchant" ? <User size={16} className="inline mr-1" /> : <Truck size={16} className="inline mr-1" />}
                  {p.name}
                </div>
                <div className="text-sm text-gray-500">₹{p.amount} | Week: {p.week}</div>
              </div>
              <div className="flex gap-3 items-center">
                <span className={`px-2 py-1 rounded ${
                  p.status === "Completed" ? "bg-green-100 text-green-700" :
                  p.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>{p.status}</span>

                {!p.gstInvoice && p.status === "Completed" && (
                  <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1" onClick={() => downloadInvoice(p.id)}>
                    <FileText size={14} /> GST Invoice
                  </button>
                )}

                {p.status === "Pending" && (
                  <button className="px-2 py-1 bg-green-100 text-green-700 rounded" onClick={() => approvePayout(p.id)}>Approve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "refunds" && (
        <div>
          {refunds.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-2xl shadow flex justify-between items-center mb-3">
              <div>
                <div className="font-medium">Order #{r.orderId} - {r.customer}</div>
                <div className="text-sm text-gray-500">₹{r.amount} | {r.type} | {r.method}</div>
              </div>
              <div className="flex gap-2 items-center">
                {r.status !== "Completed" && (
                  <>
                    <button className="px-2 py-1 bg-green-100 text-green-700 rounded" onClick={() => updateRefundStatus(r.id, "Completed")}>Approve</button>
                    <button className="px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => updateRefundStatus(r.id, "Rejected")}>Reject</button>
                  </>
                )}
                <span className={`px-2 py-1 rounded ${
                  r.status === "Completed" ? "bg-green-100 text-green-700" :
                  r.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
