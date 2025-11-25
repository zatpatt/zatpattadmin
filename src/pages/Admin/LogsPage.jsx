// src/pages/Admin/LogsPage.jsx
import React, { useState } from "react";
import { LogIn, ClipboardList, CreditCard, Server, AlertCircle, Download } from "lucide-react";

const dummyLogs = {
  login: [
    { id: 1, user: "Rahul Sharma", time: "2025-11-20 09:15", status: "Success" },
    { id: 2, user: "Priya Singh", time: "2025-11-20 09:50", status: "Failed" },
  ],
  orders: [
    { id: 101, user: "Rahul Sharma", action: "Placed Order", time: "2025-11-20 10:00" },
    { id: 102, user: "Priya Singh", action: "Cancelled Order", time: "2025-11-20 10:30" },
  ],
  payments: [
    { id: 201, user: "Rahul Sharma", method: "Credit Card", amount: 420, status: "Success" },
  ],
  api: [
    { id: 301, endpoint: "/api/orders", status: 200, time: "2025-11-20 10:01" },
  ],
  errors: [
    { id: 401, message: "Payment gateway timeout", time: "2025-11-20 10:05" },
  ],
};

export default function LogsPage() {
  const [logType, setLogType] = useState("login");

  const handleDownload = () => {
    alert(`Downloading ${logType} logs...`);
  };

  const renderLogs = () => {
    switch (logType) {
      case "login":
        return dummyLogs.login.map((l) => (
          <div key={l.id} className="flex justify-between border-b py-1">
            <div>{l.user}</div>
            <div>{l.time}</div>
            <div className={l.status === "Success" ? "text-green-600" : "text-red-600"}>
              {l.status}
            </div>
          </div>
        ));
      case "orders":
        return dummyLogs.orders.map((l) => (
          <div key={l.id} className="flex justify-between border-b py-1">
            <div>{l.user}</div>
            <div>{l.action}</div>
            <div>{l.time}</div>
          </div>
        ));
      case "payments":
        return dummyLogs.payments.map((l) => (
          <div key={l.id} className="flex justify-between border-b py-1">
            <div>{l.user}</div>
            <div>{l.method}</div>
            <div>₹{l.amount}</div>
            <div className={l.status === "Success" ? "text-green-600" : "text-red-600"}>
              {l.status}
            </div>
          </div>
        ));
      case "api":
        return dummyLogs.api.map((l) => (
          <div key={l.id} className="flex justify-between border-b py-1">
            <div>{l.endpoint}</div>
            <div>{l.status}</div>
            <div>{l.time}</div>
          </div>
        ));
      case "errors":
        return dummyLogs.errors.map((l) => (
          <div key={l.id} className="flex justify-between border-b py-1">
            <div>{l.message}</div>
            <div>{l.time}</div>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Admin Logs & Debugging</h2>

      {/* Log Type Selector */}
      <div className="flex gap-3 mb-3">
        <button
          className={`px-4 py-2 rounded-xl ${
            logType === "login" ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setLogType("login")}
        >
          <LogIn size={16} className="inline mr-1" /> Login Logs
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            logType === "orders" ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setLogType("orders")}
        >
          <ClipboardList size={16} className="inline mr-1" /> Order Logs
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            logType === "payments" ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setLogType("payments")}
        >
          <CreditCard size={16} className="inline mr-1" /> Payment Logs
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            logType === "api" ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setLogType("api")}
        >
          <Server size={16} className="inline mr-1" /> API Logs
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            logType === "errors" ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setLogType("errors")}
        >
          <AlertCircle size={16} className="inline mr-1" /> Error Logs
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-1">{renderLogs()}</div>

      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Download size={16} /> Download Logs
        </button>
      </div>
    </div>
  );
}
