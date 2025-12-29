import React, { useEffect, useState } from "react";
import { Plus, Edit, Globe } from "lucide-react";
import {
  addBanner,
  listBanners,
  updateBanner,
} from "../../services/bannersApi";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: "",
    type: "Homepage",
    region: "",
    link: "",
    start_date: "",
    end_date: "",
    image: null,
  });

  const [editBanner, setEditBanner] = useState(null);

  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    message: "",
  });

  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const res = await listBanners();
        if (res?.status) {
          setBanners(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  /* ================= ADD BANNER ================= */
  const handleAddBanner = async () => {
    if (!newBanner.title || !newBanner.image) {
      setPopup({
        open: true,
        type: "error",
        message: "Title and image are required",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newBanner.title);
    formData.append("type", newBanner.type);
    formData.append("region", newBanner.region);
    formData.append("link", newBanner.link);
    formData.append("start_date", newBanner.start_date);
    formData.append("end_date", newBanner.end_date);
    formData.append("image_url", newBanner.image);

    setLoading(true);
    const res = await addBanner(formData);
    setLoading(false);

    if (!res?.status) {
      setPopup({
        open: true,
        type: "error",
        message: res?.message || "Failed to add banner",
      });
      return;
    }

    const refreshed = await listBanners();
    if (refreshed?.status) setBanners(refreshed.data || []);

    setNewBanner({
      title: "",
      type: "Homepage",
      region: "",
      link: "",
      start_date: "",
      end_date: "",
      image: null,
    });

    setPopup({
      open: true,
      type: "success",
      message: "Banner added successfully",
    });
  };

  /* ================= UPDATE BANNER ================= */
  const saveEditBanner = async () => {
    setLoading(true);
    const res = await updateBanner({
      banner_id: editBanner.banner_id,
      region: editBanner.region,
      type: editBanner.type,
    });
    setLoading(false);

    if (!res?.status) {
      setPopup({
        open: true,
        type: "error",
        message: res?.message || "Update failed",
      });
      return;
    }

    setBanners((prev) =>
      prev.map((b) =>
        b.banner_id === editBanner.banner_id
          ? editBanner
          : b
      )
    );

    setEditBanner(null);
    setPopup({
      open: true,
      type: "success",
      message: "Banner updated successfully",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">
        🖼 App Banners & Sliders
      </h2>

      {/* ================= ADD BANNER ================= */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus size={16} /> Add New Banner
        </h3>

        <input
          placeholder="Banner title"
          value={newBanner.title}
          onChange={(e) =>
            setNewBanner({ ...newBanner, title: e.target.value })
          }
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="file"
          onChange={(e) =>
            setNewBanner({
              ...newBanner,
              image: e.target.files[0],
            })
          }
          className="border p-2 rounded-lg w-full"
        />

        <div className="flex gap-3">
          <select
            value={newBanner.type}
            onChange={(e) =>
              setNewBanner({ ...newBanner, type: e.target.value })
            }
            className="border p-2 rounded-lg flex-1"
          >
            <option value="Homepage">Homepage</option>
            <option value="Category">Category</option>
            <option value="Slider">Slider</option>
          </select>

          <input
            placeholder="Region (e.g. Vasind West)"
            value={newBanner.region}
            onChange={(e) =>
              setNewBanner({ ...newBanner, region: e.target.value })
            }
            className="border p-2 rounded-lg flex-1"
          />
        </div>

        <button
          onClick={handleAddBanner}
          className="bg-orange-500 text-white px-5 py-2 rounded-xl"
        >
          Add Banner
        </button>
      </div>

      {/* ================= BANNER LIST ================= */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        {banners.map((b) => (
          <div
            key={b.banner_id}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={b.image_url || "https://via.placeholder.com/300x100"}
                alt={b.title}
                className="w-40 h-20 object-cover rounded-lg"
              />

              <div>
                <div className="font-semibold">
                  {b.title}
                </div>
                <div className="text-sm text-gray-500">
                  {b.type} | {b.region}{" "}
                  <Globe size={14} className="inline ml-1" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditBanner(b)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1"
            >
              <Edit size={16} /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editBanner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-3">
            <h3 className="font-semibold text-lg">
              Edit Banner
            </h3>

            <select
              value={editBanner.type}
              onChange={(e) =>
                setEditBanner({
                  ...editBanner,
                  type: e.target.value,
                })
              }
              className="border p-2 rounded-lg w-full"
            >
              <option value="Homepage">Homepage</option>
              <option value="Category">Category</option>
              <option value="Slider">Slider</option>
            </select>

            <input
              value={editBanner.region}
              onChange={(e) =>
                setEditBanner({
                  ...editBanner,
                  region: e.target.value,
                })
              }
              className="border p-2 rounded-lg w-full"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditBanner(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEditBanner}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
