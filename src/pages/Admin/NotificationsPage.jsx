// src/pages/Admin/NotificationsPage.jsx
import React, { useState } from "react";
import { Bell, Users, Truck, Send } from "lucide-react";

const dummyNotifications = [
  { id: 1, type: "Push", target: "All Users", message: "New discount available!", date: "2025-11-20" },
  { id: 2, type: "SMS", target: "Merchants", message: "Monthly payout processed.", date: "2025-11-19" },
  { id: 3, type: "Push", target: "Delivery Partners", message: "App update required.", date: "2025-11-18" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Push");
  const [target, setTarget] = useState("All Users");

  const sendNotification = () => {
    if (!message.trim()) return;
    const newNotif = {
      id: Date.now(),
      type,
      target,
      message,
      date: new Date().toISOString().split("T")[0],
    };
    setNotifications([newNotif, ...notifications]);
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell size={20} /> Notifications
      </h2>

      {/* Send Notification */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <div className="flex gap-3">
          <select
            className="border p-2 rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Push">Push Notification</option>
            <option value="SMS">Bulk SMS</option>
          </select>

          <select
            className="border p-2 rounded-lg"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option>All Users</option>
            <option>Merchants</option>
            <option>Delivery Partners</option>
          </select>

          <input
            type="text"
            placeholder="Enter message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={sendNotification}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-1"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="border-b last:border-none p-2 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="font-medium">{n.message}</div>
              <div className="text-sm text-gray-500">
                {n.type} to {n.target} • {n.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
