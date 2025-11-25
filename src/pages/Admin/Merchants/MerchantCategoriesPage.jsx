// src/pages/Admin/MerchantCategoriesPage.jsx
import React, { useEffect, useState } from "react";

const CAT_KEY = "admin_merchant_categories_v2";
const MER_KEY = "admin_merchants_v2";

export default function MerchantCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setCats(JSON.parse(localStorage.getItem(CAT_KEY) || "[]"));
    setMerchants(JSON.parse(localStorage.getItem(MER_KEY) || "[]"));
  }, []);

  useEffect(() => localStorage.setItem(CAT_KEY, JSON.stringify(cats)), [cats]);

  const add = () => { if (!name.trim()) return; setCats([{ id: Date.now(), name, visible: true }, ...cats]); setName(""); };
  const remove = id => setCats(cats.filter(c => c.id !== id));
  const toggle = id => setCats(cats.map(c => c.id === id ? { ...c, visible: !c.visible } : c));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">📂 Merchant Categories</h2>
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="New category" className="flex-1 border p-2 rounded-xl" />
          <button onClick={add} className="bg-orange-500 text-white px-3 py-2 rounded">Add</button>
        </div>
        <div className="space-y-2">
          {cats.map(c => (
            <div key={c.id} className="flex justify-between items-center border p-2 rounded">
              <div>{c.name} {c.visible ? <span className="text-xs text-green-600 ml-2">visible</span> : <span className="text-xs text-gray-500 ml-2">hidden</span>}</div>
              <div className="flex gap-2">
                <button onClick={() => toggle(c.id)} className="px-2 py-1 rounded bg-amber-400 text-white text-sm">Toggle</button>
                <button onClick={() => remove(c.id)} className="px-2 py-1 rounded bg-red-100 text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {!cats.length && <div className="text-gray-400 p-4">No categories yet.</div>}
        </div>
      </div>
    </div>
  );
}
