import React, { useEffect, useState } from "react";
import { MapPin, Map, RefreshCw, Plus } from "lucide-react";
import {
  createGeoZone,
  listGeoZones,
} from "../../services/geoZonesApi";

export default function GeoZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newZone, setNewZone] = useState({
    name: "",
    city: "",
    state: "",
    center_lat: "",
    center_lon: "",
    radius_km: "",
    is_active: true,
  });

  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    message: "",
  });

  /* ================= FETCH ZONES ================= */
  useEffect(() => {
    const fetchZones = async () => {
      setLoading(true);
      try {
        const res = await listGeoZones();
        if (res?.status) {
          setZones(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  /* ================= ADD ZONE ================= */
  const handleAddZone = async () => {
    if (!newZone.name || !newZone.city || !newZone.state) {
      setPopup({
        open: true,
        type: "error",
        message: "Please fill required fields",
      });
      return;
    }

    setLoading(true);
    const res = await createGeoZone({
      ...newZone,
      center_lat: newZone.center_lat
        ? Number(newZone.center_lat)
        : null,
      center_lon: newZone.center_lon
        ? Number(newZone.center_lon)
        : null,
      radius_km: newZone.radius_km
        ? Number(newZone.radius_km)
        : null,
    });
    setLoading(false);

    if (!res?.status) {
      setPopup({
        open: true,
        type: "error",
        message: res?.message || "Failed to create zone",
      });
      return;
    }

    // refresh list
    const refreshed = await listGeoZones();
    if (refreshed?.status) {
      setZones(refreshed.data || []);
    }

    setNewZone({
      name: "",
      city: "",
      state: "",
      center_lat: "",
      center_lon: "",
      radius_km: "",
      is_active: true,
    });

    setPopup({
      open: true,
      type: "success",
      message: "Geo zone created successfully",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">📍 Geo Zones</h2>

      {/* ================= ADD ZONE ================= */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} /> Add New Geo Zone
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            placeholder="Zone Name"
            value={newZone.name}
            onChange={(e) =>
              setNewZone({ ...newZone, name: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="City"
            value={newZone.city}
            onChange={(e) =>
              setNewZone({ ...newZone, city: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="State"
            value={newZone.state}
            onChange={(e) =>
              setNewZone({ ...newZone, state: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Center Latitude"
            value={newZone.center_lat}
            onChange={(e) =>
              setNewZone({ ...newZone, center_lat: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Center Longitude"
            value={newZone.center_lon}
            onChange={(e) =>
              setNewZone({ ...newZone, center_lon: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Radius (km)"
            value={newZone.radius_km}
            onChange={(e) =>
              setNewZone({ ...newZone, radius_km: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleAddZone}
          className="mt-3 bg-orange-500 text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} /> Create Zone
        </button>
      </div>

      {/* ================= ZONE LIST ================= */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-4 rounded-2xl shadow space-y-2"
          >
            <div className="font-semibold text-lg">
              {zone.name}
            </div>

            <div className="text-sm text-gray-600 flex flex-wrap gap-4">
              <span>
                <MapPin size={14} className="inline" /> {zone.city},{" "}
                {zone.state}
              </span>
              <span>
                <Map size={14} className="inline" /> Radius:{" "}
                {zone.radius_km ?? "—"} km
              </span>
              <span>
                Status:{" "}
                <span
                  className={
                    zone.is_active
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  {zone.is_active ? "Active" : "Inactive"}
                </span>
              </span>
            </div>

            {/* Placeholder map */}
            <div className="h-28 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 rounded-lg flex items-center justify-center text-gray-500">
              Geo Radius Preview
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP ================= */}
      {popup.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3
              className={`text-lg font-semibold ${
                popup.type === "error"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {popup.type === "error" ? "Error" : "Success"}
            </h3>

            <p className="text-sm text-gray-600">
              {popup.message}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  setPopup({ open: false, type: "success", message: "" })
                }
                className="px-4 py-2 rounded bg-orange-500 text-white"
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
