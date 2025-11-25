import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserX, Users, CheckCircle } from "lucide-react";

const dummyCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    totalOrders: 12,
    loyalty: 240,
    blocked: false,
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "9932011122",
    totalOrders: 5,
    loyalty: 80,
    blocked: true,
  },
];

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = dummyCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-3">
        <Users size={26} className="text-orange-500" />
        <h2 className="text-xl font-semibold">Customers</h2>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white p-3 rounded-xl shadow">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full outline-none"
        />
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow divide-y">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/admin/customers/${c.id}`)}
          >
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-500">{c.phone}</div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-sm text-gray-600">
                Orders: <strong>{c.totalOrders}</strong>
              </div>
              <div className="text-sm">
                Loyalty: <span className="font-semibold">{c.loyalty}</span>
              </div>
              <div className="text-sm flex items-center gap-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    c.blocked ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {c.blocked ? "Inactive" : "Active"}
                </span>
              </div>
              {c.blocked && (
                <div className="text-red-500 flex items-center mt-1 text-sm">
                  <UserX size={14} className="mr-1" /> Blocked
                </div>
              )}
              {!c.blocked && (
                <div className="text-green-500 flex items-center mt-1 text-sm">
                  <CheckCircle size={14} className="mr-1" /> Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
