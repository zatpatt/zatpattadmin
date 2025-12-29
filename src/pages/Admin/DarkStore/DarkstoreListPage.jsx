//src\pages\Admin\DarkStore\DarkstoreListPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Store,
  Search,
  MapPin,
  AlertTriangle,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
} from "react-leaflet";
import L from "leaflet";

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

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const activeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= TIME HELPERS ================= */

const getTodayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

  const getTodayTiming = (timings = []) => {
    const today = getTodayName();
    return timings.find((t) => t.day === today);
  };

  // ⚠️ TECH DEBT
// Same timing logic exists in DarkstoreProductsPage (isWithinStoreTiming)
// Later move both into shared utils/storeTiming.js
  const isStoreOpenNow = (timing) => {
  if (!timing || !timing.is_open) return false;

  const now = new Date();
  const [sh, sm] = timing.start.split(":").map(Number);
  const [eh, em] = timing.end.split(":").map(Number);

  const start = new Date();
  start.setHours(sh, sm, 0, 0);

  const end = new Date();
  end.setHours(eh, em, 0, 0);

  return now >= start && now <= end;
};

export default function DarkstoreListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= STATE ================= */
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  

  /* ================= INIT MOCK DATA ================= */
 useEffect(() => {
  const baseStores = [
    {
      id: 1,
      store_code: "DS-01",
      store_name: "Zatpatt Darkstore - DS-01",
      store_type: "darkstore",
      area: "Vasind",
      address: "Plot 23, Main Road",
      landmark: "Opposite ABC School",
      lat: 19.3782,
      lng: 73.1764,
      manager: "Rahul Sharma",
      open_time: "07:00",
      close_time: "23:00",
      offline_reason: "staff",
      is_active: true,
      archived: false,
      zone: [
        [19.379, 73.174],
        [19.382, 73.176],
        [19.380, 73.181],
        [19.377, 73.179],
      ],
      heat: 0.7,
      timings: [
  { day: getTodayName(), is_open: true, start: "08:00", end: "22:00" },
],
pincode: "000000",
city: "—",
sla_minutes: 15,
service_radius_km: 3,
daily_capacity: 240,

    },
    {
      id: 2,
      store_code: "DS-02",
      store_name: "Zatpatt Darkstore - DS-02",
      store_type: "darkstore",
      area: "Bandra",
      address: "Hill Road",
      landmark: "Linking Road",
      lat: 19.0606,
      lng: 72.8295,
      manager: "Neha Singh",
      open_time: "08:00",
      close_time: "22:00",
      offline_reason: "manual",
      is_active: false,
      archived: false,
      zone: [
        [19.061, 72.827],
        [19.064, 72.829],
        [19.062, 72.833],
        [19.059, 72.831],
      ],
      heat: 0.4,
      timings: [
  { day: getTodayName(), is_open: true, start: "08:00", end: "22:00" },
],
pincode: "000000",
city: "—",
sla_minutes: 15,
service_radius_km: 3,
daily_capacity: 240,

    },
  ];

  const saved = JSON.parse(localStorage.getItem("darkstores"));

  if (saved && saved.length) {
    setStores(saved);
  } else {
    setStores(baseStores);
    localStorage.setItem("darkstores", JSON.stringify(baseStores));
  }
}, []);


  /* ================= SEARCH ================= */
  const filteredStores = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        !s.archived &&
        (
          s.store_name +
          s.area +
          s.landmark +
          s.address
        )
          .toLowerCase()
          .includes(q)
    );
  }, [stores, search]);

  /* ================= ACTIONS ================= */

  const handleToggleClick = (store) => {
  const todayTiming = getTodayTiming(store.timings || []);

  const holidayClosed = todayTiming && !todayTiming.is_open;
  const timingEnded =
    todayTiming &&
    todayTiming.is_open &&
    !isStoreOpenNow(todayTiming);

  // 🔒 Staff lock → no action
  if (store.offline_reason === "staff") return;

  // 🚫 Holiday closed popup
  if (holidayClosed && !store.is_active) {
    setConfirmDeactivate({
      ...store,
      reason: "holiday",
    });
    return;
  }

  // ⏰ Timing ended popup
  if (timingEnded && !store.is_active) {
    setConfirmDeactivate({
      ...store,
      reason: "timing",
    });
    return;
  }

  // Normal deactivate
  if (store.is_active) {
    setConfirmDeactivate(store);
  } else {
    toggleStore(store.id);
  }
};

  const toggleStore = (id) => {
  const updated = stores.map((s) =>
    s.id === id ? { ...s, is_active: !s.is_active } : s
  );

  setStores(updated);
  localStorage.setItem("darkstores", JSON.stringify(updated));

  // ✅ CLOSE POPUP AFTER CONFIRM
  setConfirmDeactivate(null);
};
 
 

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex gap-2">
          <Store className="text-orange-500" />
          Darkstores
        </h1>

        <button
          onClick={() => navigate("/admin/darkstores/new")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} /> Add Darkstore
        </button>
      </div>

      {/* MAP */}
     <div className="relative z-0 h-72 rounded-xl overflow-hidden border">
        <MapContainer
          center={
            selectedStore
              ? [selectedStore.lat, selectedStore.lng]
              : [19.2, 73.0]
          }
          zoom={selectedStore ? 14 : 6}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

         {filteredStores.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={
              selectedStore?.id === s.id
                ? activeIcon
                : defaultIcon
            }
            eventHandlers={{
              click: () => setSelectedStore(s),
            }}
          />
        ))}

          {selectedStore?.zone && (
            <Polygon
              positions={selectedStore.zone}
              pathOptions={{
                color: "#f97316",
                fillOpacity: selectedStore.heat,
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          placeholder="Search store / area / landmark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* STORE LIST */}
      <div className="grid gap-4">
        {filteredStores.map((s) => {
  // ===== DERIVED VALUES (MUST BE FIRST) =====
    const todayTiming = getTodayTiming(s.timings || []);
    const isHoliday = todayTiming && !todayTiming.is_open;

    const isOnline =
      typeof s.computed_active === "boolean"
      ? s.computed_active
      : s.is_active;

    const openStart = todayTiming?.start;
    const openEnd = todayTiming?.end;

    const timingEnded =
    todayTiming &&
    todayTiming.is_open &&
    !isStoreOpenNow(todayTiming);
   
    const managerName = s.manager || "Manager Not Assigned";
    const managerShift =
    todayTiming?.start && todayTiming?.end
      ? `${todayTiming.start} – ${todayTiming.end}`
      : "—";

    const staffLocked = s.offline_reason === "staff";
    const holidayClosed = todayTiming && !todayTiming.is_open;
    const timingLocked = timingEnded;

    const toggleLocked =
    (s.offline_reason === "staff" && !s.computed_active) ||
    (s.offline_reason === "stock" && !s.computed_active) ||
    (s.offline_reason === "timing" && !isStoreOpenNow(todayTiming));



    // ===== JSX AFTER VARIABLES =====
  return (
    <div
      key={s.id}
      onClick={() => setSelectedStore(s)}
      className={`border rounded-xl p-4 flex justify-between cursor-pointer transition
        ${
          selectedStore?.id === s.id
            ? "border-orange-500 bg-orange-50"
            : ""
        }`}
    >
            <div>
              <h3 className="font-semibold">{s.store_name}</h3>
              <p className="text-sm text-gray-600">
          📍 {s.area}, {s.address}, {s.landmark}, {s.city}, {s.pincode}
        </p>

        <p className="text-xs text-gray-400">
          Lat: {s.lat}, Lng: {s.lng}
        </p>

        <p className="text-xs text-gray-700 mt-1">
          👤 Manager: {managerName} ({managerShift})
        </p>

        <p className="text-xs text-gray-700">
         Capacity: {s.daily_capacity} orders/day
        </p>

        <p className="text-xs text-gray-700">
          SLA (min): {s.sla_minutes} | Service radius: {s.service_radius_km} km
        </p>

        <p className="text-xs mt-1">
          🕒 Today:{" "}
          {isHoliday ? (
            <span className="text-red-600 font-medium">Closed (Holiday)</span>
          ) : (
            <span className="text-green-600 font-medium">
             {openStart && openEnd ? (
            <span className="text-green-600 font-medium">
              Open ({openStart} – {openEnd})
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Closed
            </span>
          )}
          </span>
          )}
        </p>
              <span
        className={`text-xs px-2 py-1 rounded ${
          isOnline
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>    
      {staffLocked && (
        <p className="text-xs text-orange-600 mt-1">
          🔒 Disabled due to no staff online
        </p>
      )}          
            </div>

            <div className="flex items-center gap-4">
              
              {/* ACTIVE TOGGLE */}
              <button
                disabled={toggleLocked}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleClick(s);
                }}

                className={`w-12 h-6 rounded-full relative ${
                  s.is_active ? "bg-orange-500" : "bg-gray-300"
                }${staffLocked ? "opacity-40 cursor-not-allowed" : ""}`}
              >

                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded ${
                      s.is_active ? "translate-x-6" : ""
                    }`}
                  />
                </button>

              <button
                onClick={() => 
                navigate(`/admin/darkstores/${s.id}/products`)
                }
                className="text-orange-500"
              >
                Manage →
              </button>          
            </div>
          </div>
          );
        })}
      </div>

           {/* CONFIRM DEACTIVATE */}
      {confirmDeactivate && (
        <Popup
          title={
  confirmDeactivate?.reason === "holiday"
    ? "Store Closed Today"
    : confirmDeactivate?.reason === "timing"
    ? "Store Timings Completed"
    : "Deactivate Store?"
}

description={
  confirmDeactivate?.reason === "holiday"
    ? "This store is closed today due to holiday timings."
    : confirmDeactivate?.reason === "timing"
    ? "Store operating hours are over. You cannot activate it right now."
    : "Orders will stop for this store."
}
          onCancel={() => setConfirmDeactivate(null)}
         onConfirm={() => {
        if (confirmDeactivate?.reason) {
          // holiday or timing popup → just close
          setConfirmDeactivate(null);
        } else {
          // normal deactivate
          toggleStore(confirmDeactivate.id);
        }
      }}
       confirmText={
  confirmDeactivate?.reason ? "OK" : "Deactivate"
}
      />
      )}    
    </div>
  );
}

/* ================= REUSABLE POPUP ================= */
function Popup({ title, description, onCancel, onConfirm, confirmText }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-96 space-y-3">
        <h3 className="font-semibold flex gap-2">
          <AlertTriangle className="text-orange-500" />
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
