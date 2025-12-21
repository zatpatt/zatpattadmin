//src\pages\Admin\DarkStore\CreateDarkStorePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDarkStorePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Dark Store Created (mock)");
    navigate("/admin/dark-stores");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Dark Store</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="text-sm text-gray-600">Store Name</label>
          <input
            required
            className="w-full border px-4 py-2 rounded-lg"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">City</label>
          <input
            required
            className="w-full border px-4 py-2 rounded-lg"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>

        <button className="w-full py-2 bg-orange-500 text-white rounded-lg">
          Create Store
        </button>
      </form>
    </div>
  );
}
