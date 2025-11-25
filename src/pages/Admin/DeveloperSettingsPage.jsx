// src/pages/Admin/DeveloperSettingsPage.jsx
import React, { useState } from "react";
import { Database, Key, Activity, Cloud, AlertCircle } from "lucide-react";

const dummySettings = {
  apiKeys: [
    { id: 1, name: "Payment Gateway", key: "pk_test_123456" },
    { id: 2, name: "Firebase", key: "AIzaSyXXXXXXX" },
  ],
  backups: [
    { id: 1, name: "Backup 01", date: "2025-11-18", status: "Success" },
    { id: 2, name: "Backup 02", date: "2025-11-19", status: "Failed" },
  ],
  logs: [
    { id: 1, type: "API", message: "GET /orders failed", date: "2025-11-20" },
    { id: 2, type: "Error", message: "DB connection timeout", date: "2025-11-20" },
  ],
};

export default function DeveloperSettingsPage() {
  const [apiKeys, setApiKeys] = useState(dummySettings.apiKeys);
  const [backups, setBackups] = useState(dummySettings.backups);
  const [logs, setLogs] = useState(dummySettings.logs);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");

  const addApiKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    setApiKeys([...apiKeys, { id: Date.now(), name: newKeyName, key: newKeyValue }]);
    setNewKeyName("");
    setNewKeyValue("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Key size={20} /> Developer & System Settings
      </h2>

      {/* API Keys */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Key size={18} /> API Keys
        </h3>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <input
            type="text"
            placeholder="Key Value"
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={addApiKey}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add Key
          </button>
        </div>

        <div className="mt-3 space-y-1">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex justify-between items-center border-b py-1">
              <div>
                <span className="font-medium">{k.name}</span>: <span className="text-gray-600">{k.key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backups */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Cloud size={18} /> Backups
        </h3>
        {backups.map((b) => (
          <div key={b.id} className="flex justify-between py-2 border-b last:border-none">
            <div>{b.name} ({b.date})</div>
            <div className={`font-medium ${b.status === "Success" ? "text-green-600" : "text-red-500"}`}>
              {b.status}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={18} /> System Logs
        </h3>
        {logs.map((l) => (
          <div key={l.id} className="flex justify-between py-2 border-b last:border-none">
            <div>[{l.type}] {l.message}</div>
            <div className="text-gray-500 text-sm">{l.date}</div>
          </div>
        ))}
      </div>

      {/* Error Monitoring */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle size={18} /> Error Monitoring
        </h3>
        <p className="text-gray-600">Track uncaught errors, server logs, and notifications for system issues.</p>
      </div>
    </div>
  );
}
