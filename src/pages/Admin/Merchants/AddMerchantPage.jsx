// src/pages/Admin/AddMerchantPage.jsx
import React, { useState } from "react";

const STORAGE_KEY = "admin_merchants_v2";

export default function AddMerchantPage() {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    commission: 10,
    status: "pending",
    earnings: 0,
    gst: "",
    fssai: "",
    pan: "",
    shopImages: [],
    operatingHours: "9AM-9PM",
    blocked: false,
  });

  const handleFileChange = (e, key) => {
    const files = Array.from(e.target.files).map(f => URL.createObjectURL(f));
    setForm({ ...form, [key]: files });
  };

  const save = () => {
    if (!form.name || !form.owner) return alert("Please fill name & owner");
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newM = { ...form, id: "m_" + Date.now() };
    list.unshift(newM);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    alert("Merchant added");
    window.location.href = "/admin/merchants";
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">➕ Add Merchant</h2>
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">

        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Store name" className="w-full border p-2 rounded-xl" />
        <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Owner name" className="w-full border p-2 rounded-xl" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border p-2 rounded-xl" />

        {/* KYC Upload */}
        <div className="space-y-1">
          <label className="text-sm">GST Certificate</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={e => handleFileChange(e, "gst")} className="w-full border p-2 rounded-xl" />
          <label className="text-sm">FSSAI Certificate</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={e => handleFileChange(e, "fssai")} className="w-full border p-2 rounded-xl" />
          <label className="text-sm">PAN</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={e => handleFileChange(e, "pan")} className="w-full border p-2 rounded-xl" />
        </div>

        {/* Shop Images */}
        <div className="space-y-1">
          <label className="text-sm">Shop Images</label>
          <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, "shopImages")} className="w-full border p-2 rounded-xl" />
          {form.shopImages.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {form.shopImages.map((img, i) => (
                <img key={i} src={img} alt="shop" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <input value={form.operatingHours} onChange={e => setForm({ ...form, operatingHours: e.target.value })} placeholder="Operating Hours" className="w-full border p-2 rounded-xl" />

        <div className="flex gap-2">
          <button onClick={save} className="bg-orange-500 text-white px-4 py-2 rounded">Save Merchant</button>
          <button onClick={() => window.location.href = "/admin/merchants"} className="border px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
