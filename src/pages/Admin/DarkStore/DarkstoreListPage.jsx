import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Store, Search, MapPin } from "lucide-react";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
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

export default function DarkstoreListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= STATE ================= */
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [radiusKm, setRadiusKm] = useState(3); // 3km / 5km

  /* ================= MOCK DATA ================= */
  
  useEffect(() => {
  setStores((prev) => {
    const baseStores = [
      {
        id: 1,
        store_code: "DS-01",
        store_name: "Zatpatt Darkstore - DS-01",
        area: "Vasind",
        address: "Plot 23, Main Road",
        landmark: "Opposite ABC School",
        lat: 19.3782,
        lng: 73.1764,
        is_active: true,
      },
      {
        id: 2,
        store_code: "DS-02",
        store_name: "Zatpatt Darkstore - DS-02",
        area: "Vasind",
        address: "Near Bus Stand",
        landmark: "XYZ Hospital",
        lat: 19.3811,
        lng: 73.1802,
        is_active: false,
      },
      {
        id: 3,
        store_code: "DS-03",
        store_name: "Zatpatt Darkstore - DS-03",
        area: "Bandra",
        address: "Hill Road",
        landmark: "Linking Road",
        lat: 19.0606,
        lng: 72.8295,
        is_active: true,
      },
    ];

    // 👇 ADD newly created store if coming from Add page
    if (location.state?.newStore) {
      return [...baseStores, location.state.newStore];
    }

    return baseStores;
  });
}, [location.state]);

  /* ================= SEARCH ================= */
  const filteredStores = useMemo(() => {
  const q = search.trim().toLowerCase();
  if (!q) return stores;

  return stores.filter((s) => {
    return (
      s.store_name?.toLowerCase().includes(q) ||
      s.area?.toLowerCase().includes(q) ||
      s.landmark?.toLowerCase().includes(q) ||
      s.address?.toLowerCase().includes(q)
    );
  });
}, [stores, search]);


  /* ================= TOGGLE ================= */
  const toggleStoreStatus = (id) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_active: !s.is_active } : s
      )
    );
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Store className="text-orange-500" />
          Darkstores
        </h1>

        <button
          onClick={() => navigate("/admin/darkstores/new")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Darkstore
        </button>
      </div>

      {/* MAP */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="text-orange-500" size={18} />
            Store Coverage Map
          </h3>

          {/* RADIUS SWITCH */}
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value={3}>3 km Radius</option>
            <option value={5}>5 km Radius</option>
          </select>
        </div>

        <div className="h-72 rounded-xl overflow-hidden border">
          <MapContainer
            center={
              selectedStore
                ? [selectedStore.lat, selectedStore.lng]
                : [19.2, 73.0]
            }
            zoom={selectedStore ? 14 : 6}
            className="h-full w-full"
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {stores.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                eventHandlers={{
                  click: () => setSelectedStore(s),
                }}
              />
            ))}

            {selectedStore && (
              <Circle
                center={[selectedStore.lat, selectedStore.lng]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: "#f97316",
                  fillColor: "#fdba74",
                  fillOpacity: 0.25,
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          placeholder="Search store / area / landmark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* STORE LIST */}
      <div className="grid gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            onClick={() => setSelectedStore(store)}
            className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer ${
              selectedStore?.id === store.id
                ? "border-orange-500 bg-orange-50"
                : ""
            }`}
          >
            <div>
              <h3 className="font-semibold">{store.store_name}</h3>
              <p className="text-sm text-gray-600">
                📍 {store.address}, {store.area}
              </p>
              <p className="text-xs text-gray-500">
                Lat: {store.lat}, Lng: {store.lng}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* TOGGLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStoreStatus(store.id);
                }}
                className={`relative w-12 h-6 rounded-full ${
                  store.is_active
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full ${
                    store.is_active ? "translate-x-6" : ""
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/darkstores/${store.id}/products`);
                }}
                className="text-orange-500 font-medium"
              >
                Manage Products →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
