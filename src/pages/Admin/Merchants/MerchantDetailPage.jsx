import React, { useEffect, useState } from "react";
import {
  getMerchantDetail,
  updateMerchant,
} from "../../../services/merchantApi";

const DAYS = [
  { label: "Monday", day: 1 },
  { label: "Tuesday", day: 2 },
  { label: "Wednesday", day: 3 },
  { label: "Thursday", day: 4 },
  { label: "Friday", day: 5 },
  { label: "Saturday", day: 6 },
  { label: "Sunday", day: 7 },
];


export default function MerchantDetailPage() {
  const merchantId = window.location.pathname.split("/").pop();

  const [merchant, setMerchant] = useState(null);
  const [form, setForm] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- LOAD MERCHANT DETAIL ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await getMerchantDetail(merchantId);
        if (!data) return;

        setMerchant(data);
        setOrders(data.orders || []);

        setForm({
          name: data.name || "",
          owner_name: data.owner_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          category: data.category || "",
          commission_value: data.commission_value || 0,
          gst_number: data.gst_number || "",
          fssai_number: data.fssai_number || "",
          pan_number: data.pan_number || "",
        working_hrs:
  data.working_hrs?.length > 0
    ? data.working_hrs.map((w) => ({
        day: w.day,
        opening_time: w.opening_time,
        closing_time: w.closing_time,
          }))
    : DAYS.map((d) => ({
        day: d.day,
        opening_time: "09:00:00",
        closing_time: "21:00:00",
                })),


        });
      } catch (err) {
        console.error(err);
        alert("Failed to load merchant details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [merchantId]);

  /* ---------------- UPDATE TIME ---------------- */
 const updateTime = (day, key, value) => {
  setForm((prev) => ({
    ...prev,
    working_hrs: prev.working_hrs.map((w) =>
      w.day === day
        ? { ...w, [key]: value }
        : w
    ),
  }));
};

const CATEGORY_CHOICES = [
  { value: "grocery", label: "Grocery" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "restaurant", label: "Restaurant" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "furniture", label: "Furniture" },
  { value: "books", label: "Books & Stationery" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "toys", label: "Toys & Kids" },
  { value: "pet_supplies", label: "Pet Supplies" },
  { value: "automotive", label: "Automotive" },
  { value: "home_appliances", label: "Home Appliances" },
  { value: "flowers", label: "Flowers & Gifts" },
  { value: "handicrafts", label: "Handicrafts & Art" },
];

  /* ---------------- SAVE ---------------- */
const saveChanges = async () => {
  try {
    setSaving(true);

    // ✅ VALIDATION (SAFE)
    const invalid = form?.working_hrs?.some(
      (w) =>
        !w.is_closed &&
        w.opening_time >= w.closing_time
    );

    if (invalid) {
      alert("Opening time must be before closing time");
      setSaving(false);
      return;
    }

    await updateMerchant({
      merchant_id: merchant.merchant_id,
      name: form.name,
      owner_name: form.owner_name,
      phone: form.phone,
      email: form.email || null,
      address: form.address || "",
      city: form.city || "",
      state: form.state || "",
      pincode: Number(form.pincode),
      category: form.category || null,
      commission_type: "percentage",
      commission_value: Number(form.commission_value),
      gst_number: form.gst_number || "",
      fssai_number: form.fssai_number || "",
      pan_number: form.pan_number || "",
      is_verified: merchant.is_verified,
      is_active: merchant.is_active,
      is_blocked: merchant.is_blocked,

      // ✅ STRIP UI-ONLY FIELDS
      working_hrs: form.working_hrs
        .filter((w) => !w.is_closed)
        .map((w) => ({
          day: w.day,
          opening_time: w.opening_time,
          closing_time: w.closing_time,
        })),
    });

    alert("Merchant updated successfully");
    setEditMode(false);
  } catch (err) {
    console.error(err);
    alert("Failed to update merchant");
  } finally {
    setSaving(false);
  }
};

  const toggleClosed = (day) => {
  setForm((prev) => ({
    ...prev,
    working_hrs: prev.working_hrs.map((w) =>
      w.day === day
        ? {
            ...w,
            is_closed: !w.is_closed,
          }
        : w
    ),
  }));
};


  /* ---------------- BLOCK / UNBLOCK ---------------- */
  const toggleBlock = async () => {
    try {
      await updateMerchant({
        merchant_id: merchant.merchant_id,
        ...merchant,
        is_blocked: !merchant.is_blocked,
        working_hrs: merchant.working_hrs,
      });

      setMerchant((p) => ({
        ...p,
        is_blocked: !p.is_blocked,
      }));
    } catch {
      alert("Failed to update block status");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!merchant || !form) return <div className="p-6">Merchant not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">🏪 Merchant Details</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2">
        {[
          ["Store Name", "name"],
          ["Owner Name", "owner_name"],
          ["Phone", "phone"],
          ["Email", "email"],
          ["Address", "address"],
          ["City", "city"],
          ["State", "state"],
          ["Pincode", "pincode"],
          ["Commission (%)", "commission_value"],
          ["GST Number", "gst_number"],
          ["FSSAI Number", "fssai_number"],
          ["PAN Number", "pan_number"],
        ].map(([label, key]) => (
          <div key={key} className="flex gap-3">
            <div className="w-40 text-gray-500">{label}</div>
            {editMode ? (
              <input
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="border p-1 rounded flex-1"
              />
            ) : (
              <div>{merchant[key] || "—"}</div>
            )}
          </div>
        ))}

{/* CATEGORY (CHOICE BASED) */}
<div className="flex gap-3">
  <div className="w-40 text-gray-500">Category</div>

  {editMode ? (
    <select
      value={form.category}
      onChange={(e) =>
        setForm({ ...form, category: e.target.value })
      }
      className="border p-1 rounded flex-1"
    >
      <option value="">Select category</option>
      {CATEGORY_CHOICES.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  ) : (
    <div>
      {
        CATEGORY_CHOICES.find(
          (c) => c.value === merchant.category
        )?.label || "—"
      }
    </div>
  )}
</div>

        <div className="mt-2">
          <b>Status:</b>{" "}
          {merchant.is_blocked ? (
            <span className="text-red-600">Blocked</span>
          ) : (
            <span className="text-green-600">Active</span>
          )}
        </div>

        <button
          onClick={toggleBlock}
          className={`mt-2 px-4 py-2 rounded ${
            merchant.is_blocked
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {merchant.is_blocked ? "Unblock" : "Block"}
        </button>
      </div>

    {/* WORKING HOURS */}
<div className="bg-white p-4 rounded-2xl shadow">
  <h4 className="font-semibold mb-2">🕒 Working Hours</h4>

{form?.working_hrs?.map((w) => {
  const d = DAYS.find((x) => x.day === w.day);

  return (
    <div key={w.day} className="flex flex-col gap-2 mb-3 border-b pb-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{d.label}</div>

        {editMode && (
          <div className="flex gap-3">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={w.is_closed}
                onChange={() => toggleClosed(w.day)}
              />{" "}
              Closed
            </label>
          </div>
        )}
      </div>

      {/* CLOSED */}
      {w.is_closed && (
        <div className="text-red-600 text-sm">Closed</div>
      )}

      {/* OPEN */}
     {!w.is_closed && (
  <div className="flex gap-2 items-center">
    {editMode ? (
      <>
        {/* OPENING TIME (00:00:00 – 23:59:59) */}
        <input
          type="time"
          step="1"                 // ✅ enables seconds
          value={w.opening_time}
          onChange={(e) =>
            updateTime(w.day, "opening_time", e.target.value)
          }
          className="border px-2 py-1 rounded"
        />

        <span>to</span>

        {/* CLOSING TIME (00:00:00 – 23:59:59) */}
        <input
          type="time"
          step="1"                 // ✅ enables seconds
          value={w.closing_time}
          onChange={(e) =>
            updateTime(w.day, "closing_time", e.target.value)
          }
          className="border px-2 py-1 rounded"
        />
      </>
    ) : (
      <span className="text-gray-600">
        {w.opening_time} – {w.closing_time}
      </span>
    )}
  </div>
)}
  </div>
  );
})}
</div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">🧾 Recent Orders</h4>
        {orders.length ? (
          orders.map((o) => (
            <div key={o.order_id} className="border-b py-2">
              {o.order_code} • ₹{o.total_amount} • {o.status}
            </div>
          ))
        ) : (
          <div className="text-gray-400">No orders</div>
        )}
      </div>
    </div>
  );
}
