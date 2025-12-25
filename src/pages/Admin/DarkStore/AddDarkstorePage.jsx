import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, MapPin } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";

/* Fix leaflet icon issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= GEOCODING HELPERS ================= */
const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  return res.json();
};

const forwardGeocode = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=1`
  );
  const data = await res.json();
  return data[0] || null;
};


/* ================= MAP CLICK HANDLER ================= */

function LocationPicker({ setForm }) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);

      const geo = await reverseGeocode(lat, lng);

      setForm((prev) => ({
        ...prev,
        lat,
        lng,
        address: geo.address?.road || prev.address,
        area:
          geo.address?.suburb ||
          geo.address?.neighbourhood ||
          prev.area,
        city:
          geo.address?.city ||
          geo.address?.town ||
          geo.address?.village ||
          prev.city,
        landmark: geo.address?.amenity || prev.landmark,
      }));
    },
  });

  return null;
}

/* ================= MAP RECENTER ================= */
function RecenterMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);

  return null;
}

export default function AddDarkstorePage() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [existingCount, setExistingCount] = useState(0);

  const [form, setForm] = useState({
    area: "",
    address: "",
    landmark: "",
    city: "",
    lat: "",
    lng: "",
  });

  /* ================= AUTO STORE CODE ================= */
  useEffect(() => {
    // 🔴 MOCK (backend later)
    const mockExistingStores = 3;
    setExistingCount(mockExistingStores);
  }, []);

  const storeNumber = String(existingCount + 1).padStart(2, "0");
  const storeCode = `DS-${storeNumber}`;
  const storeName = `Zatpatt Darkstore - ${storeCode}`;

  /* ================= SUBMIT ================= */
 const handleSubmit = () => {
  if (!form.area || !form.address || !form.city || !form.lat || !form.lng) {
    alert("Please fill all required fields and pick location on map");
    return;
  }

  const newStore = {
    id: Date.now(), // temporary frontend ID
    store_code: storeCode,
    store_name: storeName,
    is_active: true,
    ...form,
  };

  navigate("/admin/darkstores", {
    state: { newStore },
  });
};

/* ================= ADDRESS → MAP ================= */
useEffect(() => {
  const timer = setTimeout(async () => {
    if (!form.address || !form.city) return;

    const query = `${form.address}, ${form.area}, ${form.city}`;
    const result = await forwardGeocode(query);

    if (result) {
      setForm((prev) => ({
        ...prev,
        lat: Number(result.lat).toFixed(6),
        lng: Number(result.lon).toFixed(6),
      }));
    }
  }, 800); // debounce

  return () => clearTimeout(timer);
}, [form.address, form.area, form.city]);

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Store className="text-orange-500" />
          Add Darkstore
        </h1>
      </div>

      {/* AUTO NAME */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Auto-generated Store Name</p>
        <p className="font-semibold text-orange-600">
          {storeName}
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <input
          placeholder="Area (e.g. Vasind)"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Address (Street / Building)"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Landmark (optional)"
          value={form.landmark}
          onChange={(e) => setForm({ ...form, landmark: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* MAP */}
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="text-orange-500" size={16} />
          Pick Store Location (Click on Map)
        </h3>

        <div className="h-72 rounded-xl overflow-hidden border">
          <MapContainer
  center={[19.2, 73.0]}
  zoom={10}
  className="h-full w-full"
>
  <TileLayer
    attribution="© OpenStreetMap"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <LocationPicker setForm={setForm} />
  <RecenterMap lat={form.lat} lng={form.lng} />

  {form.lat && form.lng && (
    <Marker position={[form.lat, form.lng]} />
  )}
</MapContainer>
      </div>
      </div>

      {/* LAT / LNG */}
      <div className="flex gap-3">
        <input
          placeholder="Latitude"
          value={form.lat}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-50"
        />
        <input
          placeholder="Longitude"
          value={form.lng}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-50"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-orange-500 text-white"
        >
          Create Darkstore
        </button>
      </div>
    </div>
  );
}
