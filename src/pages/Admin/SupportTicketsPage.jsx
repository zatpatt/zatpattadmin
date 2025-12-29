import React, { useEffect, useState } from "react";
import {
  User,
  Truck,
  ShoppingCart,
  CheckCircle,
  MessageCircle,
  Info,
  X,
} from "lucide-react";

import {
  listSupportTickets,
  getTicketDetails,
  updateTicketStatus,
  addTicketMessage,
} from "../../services/supportTicketsApi";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  /* ================= FETCH TICKET LIST ================= */
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await listSupportTickets();
      if (res?.status) {
        setTickets(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const getIcon = (type) => {
    if (type === "customer") return <User size={18} />;
    if (type === "merchant") return <ShoppingCart size={18} />;
    return <Truck size={18} />;
  };

  const statusColor = (status) => {
    if (status === "resolved") return "text-green-600";
    return "text-orange-600";
  };

  /* ================= OPEN CHAT ================= */
  const openTicket = async (ticket) => {
    setLoading(true);
    try {
      const res = await getTicketDetails({
        ticket_id: ticket.ticket_id,
      });
      if (res?.status) {
        setActiveTicket(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND MESSAGE (PERSISTED) ================= */
  const sendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;

    setLoading(true);
    try {
      const res = await addTicketMessage({
        ticket_id: activeTicket.ticket_id,
        message: replyText,
      });

      if (res?.status) {
        // 🔄 Re-fetch ticket to get latest messages
        const updated = await getTicketDetails({
          ticket_id: activeTicket.ticket_id,
        });
        if (updated?.status) {
          setActiveTicket(updated.data);
        }
        setReplyText("");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK RESOLVED ================= */
  const resolveTicket = async () => {
    if (!activeTicket || activeTicket.status === "resolved") return;

    setLoading(true);
    try {
      const res = await updateTicketStatus({
        ticket_id: activeTicket.ticket_id,
        status: "resolved",
      });

      if (res?.status) {
        setTickets((prev) =>
          prev.map((t) =>
            t.ticket_id === activeTicket.ticket_id
              ? { ...t, status: "resolved" }
              : t
          )
        );
        setActiveTicket((prev) => ({
          ...prev,
          status: "resolved",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">
        🎧 Complaints & Support Tickets
      </h2>

      {/* ================= TICKET LIST ================= */}
      {tickets.map((t) => (
        <div
          key={t.ticket_id}
          className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              {getIcon(t.ticket_type)}
              {t.ticket_type.toUpperCase()} Ticket #{t.ticket_id}
            </div>

            <div className="text-sm text-gray-600">
              <strong>Created By:</strong> {t.created_by_email}
            </div>

            <div className="text-sm">
              <strong>Issue:</strong> {t.issue_title}
            </div>

            <div className={`text-sm font-medium ${statusColor(t.status)}`}>
              Status: {t.status.toUpperCase()}
            </div>
          </div>

          <button
            onClick={() => openTicket(t)}
            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200"
          >
            <Info size={18} />
          </button>
        </div>
      ))}

      {/* ================= CHAT PANEL ================= */}
      {activeTicket && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full flex flex-col">
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="font-semibold">
                Ticket #{activeTicket.ticket_id}
              </div>
              <button onClick={() => setActiveTicket(null)}>
                <X size={18} />
              </button>
            </div>

            {/* DETAILS */}
            <div className="p-4 text-sm text-gray-600 border-b space-y-1">
              <div><strong>User:</strong> {activeTicket.created_by_email}</div>
              {activeTicket.order_id && (
                <div><strong>Order ID:</strong> #{activeTicket.order_id}</div>
              )}
              <div><strong>Issue:</strong> {activeTicket.issue_title}</div>
              <div className={statusColor(activeTicket.status)}>
                <strong>Status:</strong> {activeTicket.status.toUpperCase()}
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {(activeTicket.messages || []).map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded text-sm max-w-[85%] ${
                    m.sender_role === "admin"
                      ? "bg-blue-100 text-blue-700 ml-auto"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <strong>
                    {m.sender_role === "admin" ? "Admin" : m.sender_email}:
                  </strong>{" "}
                  {m.message}
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="p-4 border-t space-y-2">
              <input
                placeholder="Type your message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />

              <div className="flex gap-2">
                <button
                  onClick={sendReply}
                  disabled={loading}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <MessageCircle size={16} /> Send
                </button>

                <button
                  onClick={resolveTicket}
                  disabled={activeTicket.status === "resolved"}
                  className={`px-4 rounded-xl ${
                    activeTicket.status === "resolved"
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
