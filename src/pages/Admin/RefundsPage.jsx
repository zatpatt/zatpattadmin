// src/pages/Admin/RefundsPage.jsx
import React, { useState } from "react";
import { CheckCircle, XCircle, User, Truck, ShoppingBag } from "lucide-react";

const dummyRefunds = [
  {
    id: 101,
    orderId: 5001,
    customer: "Rahul Sharma",
    amount: 420,
    type: "Full",
    method: "Wallet",
    status: "Pending",
  },
  {
    id: 102,
    orderId: 5002,
    customer: "Priya Singh",
    amount: 180,
    type: "Partial",
    method: "Bank",
    status: "Completed",
  },
];

const dummyComplaints = [
  {
    id: 201,
    from: "Customer",
    name: "Rahul Sharma",
    issue: "Late delivery",
    assignedTo: "Support Team",
    status: "Open",
  },
  {
    id: 202,
    from: "Merchant",
    name: "Coffee House",
    issue: "Item not received",
    assignedTo: "Support Team",
    status: "Resolved",
  },
  {
    id: 203,
    from: "Delivery Partner",
    name: "Ravi Kumar",
    issue: "Order cancelled",
    assignedTo: "Support Team",
    status: "Open",
  },
];

export default function RefundsPage() {
  const [refunds, setRefunds] = useState(dummyRefunds);
  const [complaints, setComplaints] = useState(dummyComplaints);

  // Update refund status
  const updateRefundStatus = (id, status) => {
    setRefunds(refunds.map(r => (r.id === id ? { ...r, status } : r)));
  };

  // Assign complaint to support
  const assignComplaint = (id) => {
    const assignee = prompt("Assign to (Support Team / Agent Name)", "Support Team");
    if (!assignee) return;
    setComplaints(
      complaints.map(c => (c.id === id ? { ...c, assignedTo: assignee } : c))
    );
  };

  // Close complaint
  const closeComplaint = (id) => {
    setComplaints(
      complaints.map(c => (c.id === id ? { ...c, status: "Resolved" } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Refunds & Complaints</h2>

      {/* Refund Requests */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Refund Requests</h3>
        {refunds.map(r => (
          <div
            key={r.id}
            className="flex justify-between items-center border-b py-2 last:border-none"
          >
            <div>
              <div className="font-medium">Order #{r.orderId} - {r.customer}</div>
              <div className="text-sm text-gray-500">
                ₹{r.amount} | {r.type} | {r.method}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {r.status !== "Completed" && (
                <>
                  <button
                    className="px-2 py-1 bg-green-100 text-green-700 rounded"
                    onClick={() => updateRefundStatus(r.id, "Completed")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded"
                    onClick={() => updateRefundStatus(r.id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
              <span
                className={`px-2 py-1 rounded ${
                  r.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : r.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Complaints */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Complaints</h3>
        {complaints.map(c => (
          <div
            key={c.id}
            className="flex justify-between items-center border-b py-2 last:border-none"
          >
            <div>
              <div className="font-medium">{c.from} - {c.name}</div>
              <div className="text-sm text-gray-500">Issue: {c.issue}</div>
              <div className="text-sm text-gray-400">Assigned to: {c.assignedTo}</div>
            </div>
            <div className="flex gap-2 items-center">
              {c.status === "Open" && (
                <>
                  <button
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    onClick={() => assignComplaint(c.id)}
                  >
                    Assign
                  </button>
                  <button
                    className="px-2 py-1 bg-green-100 text-green-700 rounded"
                    onClick={() => closeComplaint(c.id)}
                  >
                    Close
                  </button>
                </>
              )}
              <span
                className={`px-2 py-1 rounded ${
                  c.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
