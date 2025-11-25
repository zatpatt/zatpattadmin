// src/pages/Admin/SupportTicketsPage.jsx
import React, { useState } from "react";
import { User, Truck, ShoppingCart, CheckCircle, XCircle, MessageCircle } from "lucide-react";

const dummyTickets = [
  {
    id: 1,
    type: "Customer",
    user: "Rahul Sharma",
    orderId: 101,
    issue: "Late delivery",
    status: "Open",
    messages: [{ from: "customer", text: "My order arrived late." }],
  },
  {
    id: 2,
    type: "Merchant",
    user: "Cafe Delight",
    orderId: null,
    issue: "Payment not credited",
    status: "Pending",
    messages: [{ from: "merchant", text: "Payment missing for last week." }],
  },
  {
    id: 3,
    type: "Delivery Partner",
    user: "Rohit Kumar",
    orderId: 102,
    issue: "App not updating orders",
    status: "Resolved",
    messages: [{ from: "partner", text: "Orders not syncing properly." }],
  },
];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(dummyTickets);
  const [replyText, setReplyText] = useState("");

  const updateStatus = (id, status) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const addReply = (id) => {
    if (!replyText.trim()) return;
    setTickets(
      tickets.map((t) =>
        t.id === id
          ? { ...t, messages: [...t.messages, { from: "admin", text: replyText }] }
          : t
      )
    );
    setReplyText("");
  };

  const getIcon = (type) => {
    if (type === "Customer") return <User size={18} />;
    if (type === "Merchant") return <ShoppingCart size={18} />;
    return <Truck size={18} />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Complaints & Support Tickets</h2>

      {tickets.map((t) => (
        <div key={t.id} className="bg-white p-4 rounded-2xl shadow space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-semibold">
              {getIcon(t.type)} {t.type} Ticket
            </div>
            <div className="flex gap-2">
              <button
                className="p-1 px-2 bg-green-100 text-green-700 rounded-lg text-sm"
                onClick={() => updateStatus(t.id, "Resolved")}
              >
                <CheckCircle size={14} /> Resolve
              </button>
              <button
                className="p-1 px-2 bg-red-100 text-red-700 rounded-lg text-sm"
                onClick={() => updateStatus(t.id, "Closed")}
              >
                <XCircle size={14} /> Close
              </button>
            </div>
          </div>

          <div className="text-gray-600">
            <div><strong>User:</strong> {t.user}</div>
            {t.orderId && <div><strong>Order ID:</strong> #{t.orderId}</div>}
            <div><strong>Issue:</strong> {t.issue}</div>
            <div><strong>Status:</strong> {t.status}</div>
          </div>

          {/* Messages */}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {t.messages.map((m, i) => (
              <div key={i} className={`p-2 rounded ${m.from === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                <strong>{m.from === "admin" ? "Admin" : t.type}:</strong> {m.text}
              </div>
            ))}
          </div>

          {/* Reply input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="border p-2 rounded-lg flex-1"
            />
            <button
              onClick={() => addReply(t.id)}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl"
            >
              <MessageCircle size={16} /> Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
