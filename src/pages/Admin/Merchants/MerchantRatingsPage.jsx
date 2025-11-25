// src/pages/Admin/MerchantRatingsPage.jsx
import React, { useEffect, useState } from "react";

const REV_KEY = "admin_ratings_v1";
const MER_KEY = "admin_merchants_v2";

export default function MerchantRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const loadedRatings = JSON.parse(localStorage.getItem(REV_KEY) || "[]");
    setRatings(loadedRatings);
    const loadedMerchants = JSON.parse(localStorage.getItem(MER_KEY) || "[]");
    setMerchants(loadedMerchants);
  }, []);

  useEffect(() => localStorage.setItem(REV_KEY, JSON.stringify(ratings)), [ratings]);

  const remove = id => setRatings(ratings.filter(r => r.id !== id));
  const bulkDelete = () => { if (!confirm("Delete all ratings?")) return; setRatings([]); };

  const filteredRatings = filter ? ratings.filter(r => r.merchantId === filter) : ratings;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">⭐ Merchant Ratings</h2>
        <button onClick={bulkDelete} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete All</button>
      </div>

      <div className="mb-4">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="">Filter by merchant</option>
          {merchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        {filteredRatings.length ? filteredRatings.map(r => (
          <div key={r.id} className="border-b py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{r.customer} • <span className="text-sm text-gray-500">{merchants.find(m => m.id === r.merchantId)?.name || r.merchantId}</span></div>
              <div className="text-sm text-gray-600">Rating: {r.rating} • {r.comment}</div>
            </div>
            <div>
              <button onClick={() => remove(r.id)} className="px-2 py-1 rounded bg-red-100 text-red-600 text-sm">Delete</button>
            </div>
          </div>
        )) : <p className="text-gray-400 p-4">No ratings found.</p>}
      </div>
    </div>
  );
}
