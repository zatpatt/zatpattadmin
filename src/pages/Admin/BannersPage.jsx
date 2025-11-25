// src/pages/Admin/BannersPage.jsx
import React, { useState } from "react";
import { Plus, Edit, Trash2, Globe } from "lucide-react";

const dummyBanners = [
  {
    id: 1,
    title: "Big Festive Sale",
    type: "Homepage",
    region: "All",
    image: "https://via.placeholder.com/300x100?text=Banner+1",
  },
  {
    id: 2,
    title: "Snacks Discount",
    type: "Category",
    region: "Delhi",
    image: "https://via.placeholder.com/300x100?text=Banner+2",
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState(dummyBanners);
  const [newBanner, setNewBanner] = useState({
    title: "",
    type: "Homepage",
    region: "All",
    image: "",
  });

  const addBanner = () => {
    if (!newBanner.title || !newBanner.image) return;
    setBanners([...banners, { ...newBanner, id: Date.now() }]);
    setNewBanner({ title: "", type: "Homepage", region: "All", image: "" });
  };

  const deleteBanner = (id) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">App Banners & Sliders</h2>

      {/* Add Banner Form */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus size={16} /> Add New Banner
        </h3>
        <input
          type="text"
          placeholder="Banner title"
          value={newBanner.title}
          onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
          className="border p-2 rounded-lg w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBanner.image}
          onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
          className="border p-2 rounded-lg w-full"
        />
        <div className="flex gap-3">
          <select
            value={newBanner.type}
            onChange={(e) => setNewBanner({ ...newBanner, type: e.target.value })}
            className="border p-2 rounded-lg flex-1"
          >
            <option value="Homepage">Homepage</option>
            <option value="Category">Category</option>
            <option value="Slider">Slider</option>
          </select>
          <input
            type="text"
            placeholder="Region (All/City)"
            value={newBanner.region}
            onChange={(e) => setNewBanner({ ...newBanner, region: e.target.value })}
            className="border p-2 rounded-lg flex-1"
          />
        </div>
        <button
          onClick={addBanner}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl"
        >
          Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="flex justify-between items-center border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <img src={b.image} alt={b.title} className="w-40 h-20 object-cover rounded-lg" />
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-gray-500">
                  Type: {b.type} | Region: {b.region} <Globe size={14} className="inline ml-1" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1">
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => deleteBanner(b.id)}
                className="p-2 bg-red-100 text-red-600 rounded-lg flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
