// src/pages/Admin/RolesAndSecurityPage.jsx
import React, { useState } from "react";
import { UserCheck, Shield, Lock } from "lucide-react";

const dummyAdmins = [
  { id: 1, name: "Super Admin", role: "Super Admin", email: "super@admin.com", active: true },
  { id: 2, name: "Merchant Manager", role: "Merchant Manager", email: "merchant@admin.com", active: true },
  { id: 3, name: "Delivery Manager", role: "Delivery Manager", email: "delivery@admin.com", active: false },
];

const availableRoles = [
  "Super Admin",
  "Merchant Manager",
  "Delivery Manager",
  "Finance Admin",
  "Support Admin",
];

export default function RolesAndSecurityPage() {
  const [admins, setAdmins] = useState(dummyAdmins);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support Admin");

  const addAdmin = () => {
    if (!name.trim() || !email.trim()) return;
    const newAdmin = {
      id: Date.now(),
      name,
      email,
      role,
      active: true,
    };
    setAdmins([...admins, newAdmin]);
    setName("");
    setEmail("");
    setRole("Support Admin");
  };

  const toggleActive = (id) => {
    setAdmins(
      admins.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Shield size={20} /> Security & User Roles
      </h2>

      {/* Add Admin */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <UserCheck size={18} /> Add New Admin
        </h3>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <select
            className="border p-2 rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {availableRoles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={addAdmin}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2">
        {admins.map((a) => (
          <div
            key={a.id}
            className="border-b last:border-none p-3 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-gray-500">
                {a.role} • {a.email}
              </div>
            </div>

            <button
              onClick={() => toggleActive(a.id)}
              className={`px-3 py-1 rounded-lg text-white ${
                a.active ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {a.active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
