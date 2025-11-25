import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Ban, CheckCircle, Star, MessageCircle, DollarSign } from "lucide-react";

const dummyCustomer = {
  id: 1,
  name: "Rahul Sharma",
  phone: "9876543210",
  loyalty: 240,
  blocked: false,
  orders: [
    { id: 101, date: "2025-11-02", amount: 420 },
    { id: 102, date: "2025-10-28", amount: 180 },
  ],
  complaints: [
    { id: 1, issue: "Late delivery", status: "Resolved" },
  ],
  refunds: [
    { id: 1, orderId: 101, amount: 50, status: "Completed" },
  ],
  tickets: [
    { id: 1, issue: "Payment not updated", status: "Open" },
  ],
};

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blocked, setBlocked] = useState(dummyCustomer.blocked);
  const [loyalty, setLoyalty] = useState(dummyCustomer.loyalty);
  const [tickets, setTickets] = useState(dummyCustomer.tickets);
  const [newTicket, setNewTicket] = useState("");

  const addTicket = () => {
    if (!newTicket.trim()) return;
    const t = { id: Date.now(), issue: newTicket, status: "Open" };
    setTickets([t, ...tickets]);
    setNewTicket("");
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Customer Details</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <div className="text-lg font-semibold">{dummyCustomer.name}</div>
        <div className="text-gray-600">{dummyCustomer.phone}</div>

        {/* Active/Inactive */}
        <div className="text-sm">
          Status: <strong className={blocked ? "text-red-500" : "text-green-600"}>{blocked ? "Inactive" : "Active"}</strong>
        </div>

        {/* Loyalty */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            <span className="text-gray-600">Loyalty Points</span>
          </div>

          <input
            type="number"
            value={loyalty}
            onChange={(e) => setLoyalty(parseInt(e.target.value))}
            className="w-20 border rounded px-2 py-1"
          />
        </div>

        {/* Block / Unblock */}
        <button
          onClick={() => setBlocked(!blocked)}
          className={`w-full py-2 mt-3 rounded-xl text-white ${
            blocked ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {blocked ? "Unblock Customer" : "Block Customer"}
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="text-orange-500" />
          <div className="font-semibold">Order History</div>
        </div>

        {dummyCustomer.orders.map((o) => (
          <div key={o.id} className="flex justify-between py-3 border-b last:border-none">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-gray-500">{o.date}</div>
            </div>
            <div className="font-semibold">₹{o.amount}</div>
          </div>
        ))}
      </div>

      {/* Refund History */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="text-green-500" />
          <div className="font-semibold">Refund History</div>
        </div>

        {dummyCustomer.refunds.map((r) => (
          <div key={r.id} className="flex justify-between py-2 border-b">
            <div>Order #{r.orderId}</div>
            <div className="flex gap-2 items-center">
              <span>₹{r.amount}</span>
              <span className="text-sm text-green-600">{r.status}</span>
            </div>
          </div>
        ))}
        {!dummyCustomer.refunds.length && <p className="text-gray-400">No refunds yet.</p>}
      </div>

      {/* Complaints */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ban className="text-red-500" />
          <div className="font-semibold">Complaints</div>
        </div>

        {dummyCustomer.complaints.map((c) => (
          <div key={c.id} className="py-2 flex justify-between items-center">
            <div>{c.issue}</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle size={14} /> {c.status}
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="text-blue-500" />
          <div className="font-semibold">Support Tickets</div>
        </div>

        <div className="flex gap-2">
          <input
            value={newTicket}
            onChange={(e) => setNewTicket(e.target.value)}
            placeholder="New support ticket"
            className="flex-1 border p-2 rounded"
          />
          <button onClick={addTicket} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
        </div>

        {tickets.length ? tickets.map(t => (
          <div key={t.id} className="flex justify-between py-2 border-b">
            <div>{t.issue}</div>
            <div className="text-sm text-gray-600">{t.status}</div>
          </div>
        )) : <p className="text-gray-400">No tickets yet.</p>}
      </div>
    </div>
  );
}
