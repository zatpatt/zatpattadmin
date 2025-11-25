// src/pages/Admin/PayoutsPage.jsx
import React, { useState } from "react";
import { Download, FileText, User, Truck } from "lucide-react";

const dummyPayouts = [
  {
    id: 1,
    type: "Merchant",
    name: "Coffee House",
    amount: 4500,
    status: "Pending",
    week: "2025-W45",
    gstInvoice: false,
  },
  {
    id: 2,
    type: "Delivery Partner",
    name: "Ravi Kumar",
    amount: 3200,
    status: "Completed",
    week: "2025-W45",
    gstInvoice: true,
  },
  {
    id: 3,
    type: "Merchant",
    name: "Snack Station",
    amount: 2100,
    status: "Failed",
    week: "2025-W46",
    gstInvoice: false,
  },
];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState(dummyPayouts);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startWeek, setStartWeek] = useState("");
  const [endWeek, setEndWeek] = useState("");

  const approvePayout = (id) => {
    setPayouts(
      payouts.map((p) =>
        p.id === id ? { ...p, status: "Completed", gstInvoice: true } : p
      )
    );
  };

  const manualPush = (id) => {
    alert(`Manual payout pushed for ID: ${id}`);
    setPayouts(
      payouts.map((p) => (p.id === id ? { ...p, status: "Completed" } : p))
    );
  };

  const downloadInvoice = (id) => {
    alert(`Download GST invoice for ID: ${id}`);
  };

  const downloadReport = () => {
    alert("Download full payout report (CSV/Excel)");
  };

  // Filter payouts based on type, status, and week range
  const filteredPayouts = payouts.filter((p) => {
    const typeMatch = typeFilter === "All" || p.type === typeFilter;
    const statusMatch = statusFilter === "All" || p.status === statusFilter;

    let weekMatch = true;
    if (startWeek && endWeek) {
      weekMatch = p.week >= startWeek && p.week <= endWeek;
    } else if (startWeek) {
      weekMatch = p.week >= startWeek;
    } else if (endWeek) {
      weekMatch = p.week <= endWeek;
    }

    return typeMatch && statusMatch && weekMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Payouts & Settlements</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-3 flex-wrap">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="All">All Types</option>
          <option value="Merchant">Merchant</option>
          <option value="Delivery Partner">Delivery Partner</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>

        <input
          type="week"
          value={startWeek}
          onChange={(e) => setStartWeek(e.target.value)}
          className="border rounded-lg p-2"
          placeholder="Start Week"
        />

        <input
          type="week"
          value={endWeek}
          onChange={(e) => setEndWeek(e.target.value)}
          className="border rounded-lg p-2"
          placeholder="End Week"
        />

        <button
          onClick={downloadReport}
          className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Download size={16} /> Download Full Report
        </button>
      </div>

      {/* Payout Cards */}
      {filteredPayouts.map((p) => (
        <div
          key={p.id}
          className="bg-white p-4 rounded-2xl shadow flex justify-between items-center mb-3"
        >
          <div>
            <div className="font-medium">
              {p.type === "Merchant" ? (
                <User size={16} className="inline mr-1" />
              ) : (
                <Truck size={16} className="inline mr-1" />
              )}
              {p.name}
            </div>
            <div className="text-sm text-gray-500">
              ₹{p.amount} | Week: {p.week}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <span
              className={`px-2 py-1 rounded ${
                p.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : p.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.status}
            </span>

            {!p.gstInvoice && p.status === "Completed" && (
              <button
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1"
                onClick={() => downloadInvoice(p.id)}
              >
                <FileText size={14} /> GST Invoice
              </button>
            )}

            {p.status === "Pending" && (
              <>
                <button
                  className="px-2 py-1 bg-green-100 text-green-700 rounded"
                  onClick={() => approvePayout(p.id)}
                >
                  Approve
                </button>
                <button
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded"
                  onClick={() => manualPush(p.id)}
                >
                  Manual Push
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Ledger / history table */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Ledger / History</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">ID</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Amount</th>
                <th className="px-3 py-2 border">Week</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">GST Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 border">{p.id}</td>
                  <td className="px-3 py-2 border">{p.type}</td>
                  <td className="px-3 py-2 border">{p.name}</td>
                  <td className="px-3 py-2 border">₹{p.amount}</td>
                  <td className="px-3 py-2 border">{p.week}</td>
                  <td className="px-3 py-2 border">{p.status}</td>
                  <td className="px-3 py-2 border">
                    {p.gstInvoice ? "✅" : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
