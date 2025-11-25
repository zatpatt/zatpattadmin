// src/pages/Admin/PromotionsPage.jsx
import React, { useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";

const dummyPromos = [
  {
    id: 1,
    code: "NEWUSER50",
    type: "Discount",
    discount: "50%",
    minOrder: 200,
    validity: { start: "2025-11-01", end: "2025-11-30" },
    region: "All",
    usage: 120,
    budget: 5000,
    active: true,
  },
  {
    id: 2,
    code: "FREEDEL",
    type: "Free Delivery",
    discount: "-",
    minOrder: 100,
    validity: { start: "2025-11-05", end: "2025-11-20" },
    region: "Mumbai",
    usage: 45,
    budget: 2000,
    active: true,
  },
];

const dummyCampaigns = [
  {
    id: 1,
    type: "Push Notification",
    title: "Weekend Offer",
    target: "All Users",
    scheduled: "2025-11-21 10:00",
    status: "Pending",
  },
  {
    id: 2,
    type: "Email",
    title: "Special Discount",
    target: "New Users",
    scheduled: "2025-11-22 12:00",
    status: "Sent",
  },
];

const dummyReferrals = [
  { id: 1, code: "REFER50", bonus: "₹50", region: "All", active: true },
  { id: 2, code: "FRIEND100", bonus: "₹100", region: "Delhi", active: false },
];

export default function PromotionsPage() {
  const [promos, setPromos] = useState(dummyPromos);
  const [newPromo, setNewPromo] = useState({
    code: "",
    type: "Discount",
    discount: "",
    minOrder: "",
    start: "",
    end: "",
    region: "All",
    budget: "",
  });

  const [campaigns, setCampaigns] = useState(dummyCampaigns);
  const [referrals, setReferrals] = useState(dummyReferrals);

  const addPromo = () => {
    if (!newPromo.code.trim()) return;
    setPromos([
      ...promos,
      { id: Date.now(), ...newPromo, usage: 0, active: true },
    ]);
    setNewPromo({
      code: "",
      type: "Discount",
      discount: "",
      minOrder: "",
      start: "",
      end: "",
      region: "All",
      budget: "",
    });
  };

  const toggleActive = (id, type = "promo") => {
    if (type === "promo") {
      setPromos(
        promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      );
    } else if (type === "referral") {
      setReferrals(
        referrals.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
      );
    }
  };

  const deletePromo = (id, type = "promo") => {
    if (type === "promo") setPromos(promos.filter((p) => p.id !== id));
    else if (type === "referral")
      setReferrals(referrals.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Promotions & Marketing</h2>

      {/* Add Promo */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus size={18} /> Create New Promotion
        </h3>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Promo Code"
            value={newPromo.code}
            onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
            className="border p-2 rounded-lg flex-1 min-w-[150px]"
          />
          <select
            value={newPromo.type}
            onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
            className="border p-2 rounded-lg"
          >
            <option value="Discount">Discount</option>
            <option value="Cashback">Cashback</option>
            <option value="Free Delivery">Free Delivery</option>
            <option value="Referral Bonus">Referral Bonus</option>
          </select>
          <input
            type="text"
            placeholder="Discount / Cashback"
            value={newPromo.discount}
            onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Min Order Amount"
            value={newPromo.minOrder}
            onChange={(e) => setNewPromo({ ...newPromo, minOrder: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={newPromo.start}
            onChange={(e) => setNewPromo({ ...newPromo, start: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={newPromo.end}
            onChange={(e) => setNewPromo({ ...newPromo, end: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Region (All / City)"
            value={newPromo.region}
            onChange={(e) => setNewPromo({ ...newPromo, region: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Budget"
            value={newPromo.budget}
            onChange={(e) => setNewPromo({ ...newPromo, budget: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <button
            onClick={addPromo}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add Promo
          </button>
        </div>
      </div>

      {/* Promo List */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Active Promotions</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Code</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Discount/Cashback</th>
                <th className="px-3 py-2 border">Min Order</th>
                <th className="px-3 py-2 border">Validity</th>
                <th className="px-3 py-2 border">Region</th>
                <th className="px-3 py-2 border">Usage</th>
                <th className="px-3 py-2 border">Budget</th>
                <th className="px-3 py-2 border">Active</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 border">{p.code}</td>
                  <td className="px-3 py-2 border">{p.type}</td>
                  <td className="px-3 py-2 border">{p.discount}</td>
                  <td className="px-3 py-2 border">₹{p.minOrder}</td>
                  <td className="px-3 py-2 border">
                    {p.validity?.start} to {p.validity?.end}
                  </td>
                  <td className="px-3 py-2 border">{p.region}</td>
                  <td className="px-3 py-2 border">{p.usage}</td>
                  <td className="px-3 py-2 border">₹{p.budget}</td>
                  <td className="px-3 py-2 border">
                    <button
                      className={`px-2 py-1 rounded ${
                        p.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                      onClick={() => toggleActive(p.id)}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-2 border flex gap-2">
                    <button className="p-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                      <Edit size={14} />
                    </button>
                    <button
                      className="p-1 bg-red-100 text-red-700 rounded flex items-center gap-1"
                      onClick={() => deletePromo(p.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Marketing Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Title</th>
                <th className="px-3 py-2 border">Target</th>
                <th className="px-3 py-2 border">Scheduled</th>
                <th className="px-3 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-3 py-2 border">{c.type}</td>
                  <td className="px-3 py-2 border">{c.title}</td>
                  <td className="px-3 py-2 border">{c.target}</td>
                  <td className="px-3 py-2 border">{c.scheduled}</td>
                  <td className="px-3 py-2 border">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Referral Tracking</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Referral Code</th>
                <th className="px-3 py-2 border">Bonus</th>
                <th className="px-3 py-2 border">Region</th>
                <th className="px-3 py-2 border">Active</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 border">{r.code}</td>
                  <td className="px-3 py-2 border">{r.bonus}</td>
                  <td className="px-3 py-2 border">{r.region}</td>
                  <td className="px-3 py-2 border">
                    <button
                      className={`px-2 py-1 rounded ${
                        r.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                      onClick={() => toggleActive(r.id, "referral")}
                    >
                      {r.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-2 border flex gap-2">
                    <button className="p-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                      <Edit size={14} />
                    </button>
                    <button
                      className="p-1 bg-red-100 text-red-700 rounded flex items-center gap-1"
                      onClick={() => deletePromo(r.id, "referral")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
