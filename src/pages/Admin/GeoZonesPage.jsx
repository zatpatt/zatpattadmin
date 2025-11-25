// src/pages/Admin/GeoZonesPage.jsx
import React, { useState } from "react";
import { MapPin, Map, DollarSign, RefreshCw } from "lucide-react";

const dummyZones = [
  { id: 1, name: "Zone A", pincodes: ["110001", "110002"], radius: 5, price: 30 },
  { id: 2, name: "Zone B", pincodes: ["110010", "110011"], radius: 8, price: 50 },
];

export default function GeoZonesPage() {
  const [zones, setZones] = useState(dummyZones);
  const [newZone, setNewZone] = useState({ name: "", pincodes: "", radius: "", price: "" });

  const handleAddZone = () => {
    if (!newZone.name || !newZone.pincodes) return;

    setZones([
      ...zones,
      {
        id: Date.now(),
        name: newZone.name,
        pincodes: newZone.pincodes.split(",").map((p) => p.trim()),
        radius: parseFloat(newZone.radius),
        price: parseFloat(newZone.price),
      },
    ]);

    setNewZone({ name: "", pincodes: "", radius: "", price: "" });
  };

  const handleDeleteZone = (id) => {
    setZones(zones.filter((z) => z.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Geo Zones & Mapping</h2>

      {/* Add New Zone */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} /> Add New Zone
        </h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Zone Name"
            value={newZone.name}
            onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
            className="border p-2 rounded-lg flex-1"
          />
          <input
            type="text"
            placeholder="Pincodes (comma separated)"
            value={newZone.pincodes}
            onChange={(e) => setNewZone({ ...newZone, pincodes: e.target.value })}
            className="border p-2 rounded-lg flex-1"
          />
          <input
            type="number"
            placeholder="Radius (km)"
            value={newZone.radius}
            onChange={(e) => setNewZone({ ...newZone, radius: e.target.value })}
            className="border p-2 rounded-lg w-32"
          />
          <input
            type="number"
            placeholder="Delivery Price"
            value={newZone.price}
            onChange={(e) => setNewZone({ ...newZone, price: e.target.value })}
            className="border p-2 rounded-lg w-32"
          />
          <button
            onClick={handleAddZone}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add Zone
          </button>
        </div>
      </div>

      {/* Zones List */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg">{zone.name}</div>
              <button
                onClick={() => handleDeleteZone(zone.id)}
                className="text-red-500 flex items-center gap-1"
              >
                <RefreshCw size={16} /> Delete
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div>
                <MapPin size={16} className="inline" /> Pincodes: {zone.pincodes.join(", ")}
              </div>
              <div>
                <Map size={16} className="inline" /> Radius: {zone.radius} km
              </div>
              <div>
                <DollarSign size={16} className="inline" /> Price: ₹{zone.price}
              </div>
            </div>
            {/* Dummy Heat Map */}
            <div className="h-32 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 rounded-lg flex items-center justify-center text-gray-500">
              Heat Map Preview
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
