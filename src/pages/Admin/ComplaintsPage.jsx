// src/pages/Admin/ComplaintsPage.jsx
import React, { useState, useMemo } from "react";
import { User, Truck, Coffee, CheckCircle, XCircle } from "lucide-react";

// Dummy complaint data
const dummyComplaints = [
  { id: 201, type: "Customer", name: "Rahul Sharma", issue: "Late delivery", assignedTo: "Support Team", status: "Open", date: "2025-11-15" },
  { id: 202, type: "Merchant", name: "Coffee House", issue: "Item not received", assignedTo: "Support Team", status: "Resolved", date: "2025-11-14" },
  { id: 203, type: "Delivery Partner", name: "Ravi Kumar", issue: "Order cancelled", assignedTo: "Support Team", status: "Open", date: "2025-11-13" },
  { id: 204, type: "Customer", name: "Priya Singh", issue: "Wrong item delivered", assignedTo: "Agent John", status: "Open", date: "2025-11-12" },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(dummyComplaints);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter complaints based on type and status
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const typeMatch = typeFilter === "All" || c.type === typeFilter;
      const statusMatch = statusFilter === "All" || c.status === statusFilter;
      return typeMatch && statusMatch;
    });
  }, [complaints, typeFilter, statusFilter]);

  // Assign complaint to a team/agent
  const assignComplaint = (id) => {
    const assignee = prompt("Assign to (Support Team / Agent Name)", "Support Team");
    if (!assignee) return;
    setComplaints(complaints.map(c => c.id === id ? { ...c, assignedTo: assignee } : c));
  };

  // Close complaint
  const closeComplaint = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Complaints</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="All">All Types</option>
          <option value="Customer">Customer</option>
          <option value="Merchant">Merchant</option>
          <option value="Delivery Partner">Delivery Partner</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border text-left">ID</th>
              <th className="px-3 py-2 border text-left">Type</th>
              <th className="px-3 py-2 border text-left">Name</th>
              <th className="px-3 py-2 border text-left">Issue</th>
              <th className="px-3 py-2 border text-left">Assigned To</th>
              <th className="px-3 py-2 border text-left">Date</th>
              <th className="px-3 py-2 border text-left">Status</th>
              <th className="px-3 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-gray-500">No complaints found</td>
              </tr>
            )}
            {filteredComplaints.map(c => (
              <tr key={c.id}>
                <td className="px-3 py-2 border">{c.id}</td>
                <td className="px-3 py-2 border flex items-center gap-1">
                  {c.type === "Customer" && <User size={16} />}
                  {c.type === "Merchant" && <Coffee size={16} />}
                  {c.type === "Delivery Partner" && <Truck size={16} />}
                  {c.type}
                </td>
                <td className="px-3 py-2 border">{c.name}</td>
                <td className="px-3 py-2 border">{c.issue}</td>
                <td className="px-3 py-2 border">{c.assignedTo}</td>
                <td className="px-3 py-2 border">{c.date}</td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-1 rounded ${
                    c.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{c.status}</span>
                </td>
                <td className="px-3 py-2 border flex gap-2">
                  {c.status === "Open" && (
                    <>
                      <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => assignComplaint(c.id)}>Assign</button>
                      <button className="px-2 py-1 bg-green-100 text-green-700 rounded" onClick={() => closeComplaint(c.id)}>Close</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
