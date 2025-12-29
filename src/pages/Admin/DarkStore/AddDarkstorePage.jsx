//src\pages\Admin\DarkStore\AddDarkstorePage.jsx

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
import { Circle } from "react-leaflet";


/* ================= LEAFLET FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= GEOCODING ================= */
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

/* ================= MAP CLICK ================= */
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

const distanceInMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


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
  const [stores, setStores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");


  const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const [form, setForm] = useState({
  area: "",
  address: "",
  landmark: "",
  city: "",
  pincode: "",

  lat: "",
  lng: "",

  service_radius_km: 3,
  warehouse_size_sqft: "",
  daily_capacity: "",
  sla_minutes: 15,

  timings: WEEK_DAYS.map((day) => ({
    day,
    is_open: true,
    start: "08:00",
    end: "23:00",
  })),
});

  const storeNumber = String(stores.length + 1).padStart(2, "0");
  const storeCode = `DS-${storeNumber}`;
  const storeName = `Zatpatt Darkstore - ${storeCode}`;

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("darkstores")) || [];
  setStores(saved);
}, []);

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
    }, 800);

    return () => clearTimeout(timer);
  }, [form.address, form.area, form.city]);

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
 if (!form.area || !form.address || !form.city || !form.pincode) {
  setErrorMsg("Please complete all location fields including pincode.");
  return;
}

if (!/^\d{6}$/.test(form.pincode)) {
  setErrorMsg("Pincode must be exactly 6 digits.");
  return;
}

const hasInvalidTiming = form.timings.some(
  (t) => t.is_open && (!t.start || !t.end || t.start >= t.end)
);

if (hasInvalidTiming) {
  setErrorMsg(
    "Please ensure all open days have valid start and end timings."
  );
  return;
}

if (!form.lat || !form.lng) {
  // Let inline map warning handle this
  return;
}


  // 🔴 DUPLICATE / OVERLAP CHECK
  for (const s of stores) {
    const d = distanceInMeters(
      Number(form.lat),
      Number(form.lng),
      Number(s.lat),
      Number(s.lng)
    );

    // Exact duplicate (within 50m)
    if (d < 50) {
      setErrorMsg(
        `A darkstore already exists very close to this location (${s.store_code}).`
      );
      return;
    }

    // Radius overlap
    const existingRadius = Number(s.service_radius_km || 3) * 1000;
    const newRadius = Number(form.service_radius_km) * 1000;

    if (d < existingRadius + newRadius) {
      setErrorMsg(
        `⚠️ Service area overlaps with ${s.store_code}. Consider reducing radius or choosing another location.`
      );
      return;
    }
  }

  const newStore = {
    id: Date.now(),
    store_code: storeCode,
    store_name: storeName,
    store_type: "darkstore",
    is_active: true,
    archived: false,
    offline_reason: "manual",
    ...form,
  };

  const updatedStores = [...stores, newStore];
  localStorage.setItem("darkstores", JSON.stringify(updatedStores));

  navigate("/admin/darkstores");
};

  /* ================= UI ================= */
  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
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
        <p className="text-sm text-gray-600">Auto-generated Store</p>
        <p className="font-semibold text-orange-600">{storeName}</p>
      </div>

      {/* LOCATION FORM */}
     <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-lg text-gray-600">Location Details</p>
      <div className="grid grid-cols-2 gap-4">
      <input
        placeholder="Area"
        value={form.area}
        onChange={(e) => setForm({ ...form, area: e.target.value })}
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        placeholder="Landmark"
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
      <input
        placeholder="Pincode"
        value={form.pincode}
        maxLength={6}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "");
          setForm({ ...form, pincode: v });
        }}
        className="w-full border rounded-lg px-3 py-2"
      />
      </div>
      </div>

      {/* MAP */}
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin size={16} className="text-orange-500" />
          Pick Location
        </h3>

        <div className="relative z-0 h-72 rounded-xl overflow-hidden border">
         <MapContainer
          center={[19.2, 73.0]}
          zoom={10}
          className="h-full w-full"
          dragging={!errorMsg}
          scrollWheelZoom={!errorMsg}
          doubleClickZoom={!errorMsg}
          zoomControl={!errorMsg}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setForm={setForm} />
            <RecenterMap lat={form.lat} lng={form.lng} />
           {form.lat && form.lng && (
            <>
              <Marker position={[form.lat, form.lng]} />
              <Circle
                center={[form.lat, form.lng]}
                radius={Number(form.service_radius_km) * 1000}
                pathOptions={{
                  color: "#f97316",
                  fillColor: "#f97316",
                  fillOpacity: 0.15,
                }}
              />
            </>
          )}
        </MapContainer>
        </div>
      </div>
      
{(!form.lat || !form.lng) && (
  <p className="text-sm text-red-600 mt-2">
    ⚠ Please click on the map to select store location
  </p>
)}

      {/* LAT / LNG */}
      <div className="flex gap-3">
        <input
          value={form.lat}
          readOnly
          placeholder="Latitude"
          className="w-full border rounded-lg px-3 py-2 bg-gray-50"
        />
        <input
          value={form.lng}
          readOnly
          placeholder="Longitude"
          className="w-full border rounded-lg px-3 py-2 bg-gray-50"
        />
      </div>
      
      
{/* OPERATIONS */}
    <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-lg text-gray-600">Store Details</p>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Service Radius (km)"
        value={form.service_radius_km}
        onChange={(e) =>
          setForm({ ...form, service_radius_km: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        type="number"
        placeholder="Warehouse Size (sqft)"
        value={form.warehouse_size_sqft}
        onChange={(e) =>
          setForm({ ...form, warehouse_size_sqft: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        type="number"
        placeholder="Daily Order Capacity"
        value={form.daily_capacity}
        onChange={(e) =>
          setForm({ ...form, daily_capacity: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        type="number"
        placeholder="SLA (minutes)"
        value={form.sla_minutes}
        onChange={(e) =>
          setForm({ ...form, sla_minutes: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      <div className="col-span-2 mt-4">
  <p className="text-md font-medium text-gray-700 mb-2">
    Store Timings
  </p>

  <div className="space-y-2">
    {form.timings.map((t, idx) => (
      <div
        key={t.day}
        className="grid grid-cols-5 gap-2 items-center"
      >
        <span className="text-sm">{t.day}</span>

        <input
          type="checkbox"
          checked={t.is_open}
          onChange={(e) => {
            const updated = [...form.timings];
            updated[idx].is_open = e.target.checked;
            setForm({ ...form, timings: updated });
          }}
        />

        <input
          type="time"
          disabled={!t.is_open}
          value={t.start}
          onChange={(e) => {
            const updated = [...form.timings];
            updated[idx].start = e.target.value;
            setForm({ ...form, timings: updated });
          }}
          className="border rounded px-2 py-1"
        />

        <span className="text-xs text-gray-400 text-center">
          to
        </span>

        <input
          type="time"
          disabled={!t.is_open}
          value={t.end}
          onChange={(e) => {
            const updated = [...form.timings];
            updated[idx].end = e.target.value;
            setForm({ ...form, timings: updated });
          }}
          className="border rounded px-2 py-1"
        />
      </div>
    ))}
  </div>
</div>

     </div>
    </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button
        onClick={handleSubmit}
        disabled={!form.lat || !form.lng}
        className={`px-4 py-2 rounded-lg text-white
          ${
            form.lat && form.lng
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        Create Darkstore
      </button>
      </div>
      
      {errorMsg && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-96 rounded-xl p-5 space-y-3">
      <h3 className="text-lg font-semibold text-red-600">
        Cannot Create Darkstore
      </h3>
      <p className="text-sm text-gray-600">{errorMsg}</p>
      <div className="flex justify-end">
        <button
          onClick={() => setErrorMsg("")}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
