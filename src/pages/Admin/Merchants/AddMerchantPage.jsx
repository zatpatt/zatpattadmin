import React, { useState } from "react";
import { addMerchant } from "../../../services/merchantApi";

const DAYS = [
  { label: "Monday", day: 1 },
  { label: "Tuesday", day: 2 },
  { label: "Wednesday", day: 3 },
  { label: "Thursday", day: 4 },
  { label: "Friday", day: 5 },
  { label: "Saturday", day: 6 },
  { label: "Sunday", day: 7 },
];

export default function AddMerchantPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    category: "",
    commission_value: "",
    gst_number: "",
    fssai_number: "",
    pan_number: "",
    working_hrs: DAYS.map((d) => ({
      day: d.day,
      opening_time: "09:00",
      closing_time: "21:00",
    })),
  });

  // update working hours
  const updateTime = (day, key, value) => {
    setForm((prev) => ({
      ...prev,
      working_hrs: prev.working_hrs.map((w) =>
        w.day === day ? { ...w, [key]: value } : w
      ),
    }));
  };

  const save = async () => {
    if (!form.name || !form.owner_name || !form.phone) {
      return alert("Please fill Store name, Owner name and Phone");
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        phone: form.phone,
        owner_name: form.owner_name,
        email: form.email || null,
        address: form.address || "",
        city: form.city || "",
        state: form.state || "",
        pincode: form.pincode || "",
        category: form.category || null,

        is_verified: true,
        commission_type: "percentage",
        commission_value: form.commission_value
          ? form.commission_value.endsWith("%")
            ? form.commission_value
            : `${form.commission_value}%`
          : "0%",

        gst_number: form.gst_number || "",
        fssai_number: form.fssai_number || "",
        pan_number: form.pan_number || "",

        // ✅ FINAL WORKING HOURS PAYLOAD
        working_hrs: form.working_hrs.map((w) => ({
          day: w.day,
          opening_time: `${w.opening_time}:00`,
          closing_time: `${w.closing_time}:00`,
        })),
      };

      await addMerchant(payload);

      alert("Merchant added successfully");
      window.location.href = "/admin/merchants";
    } catch (err) {
      console.error("ADD MERCHANT ERROR:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Failed to add merchant. Check backend logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">➕ Add Merchant</h2>

      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Store name"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.owner_name}
          onChange={(e) =>
            setForm({ ...form, owner_name: e.target.value })
          }
          placeholder="Owner name"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
          placeholder="Address"
          className="w-full border p-2 rounded-xl"
        />

        <div className="grid grid-cols-3 gap-2">
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="City"
            className="border p-2 rounded-xl"
          />
          <input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            placeholder="State"
            className="border p-2 rounded-xl"
          />
          <input
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
            placeholder="Pincode"
            className="border p-2 rounded-xl"
          />
        </div>

        <input
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          placeholder="Category"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.commission_value}
          onChange={(e) =>
            setForm({ ...form, commission_value: e.target.value })
          }
          placeholder="Commission (e.g. 6%)"
          className="w-full border p-2 rounded-xl"
        />

        {/* 🕒 WORKING HOURS */}
        <div className="border rounded-xl p-3">
          <h3 className="font-semibold mb-2">🕒 Store Timings</h3>
          {DAYS.map((d) => {
            const w = form.working_hrs.find((x) => x.day === d.day);
            return (
              <div
                key={d.day}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-24 text-sm">{d.label}</div>
                <input
                  type="time"
                  value={w.opening_time}
                  onChange={(e) =>
                    updateTime(d.day, "opening_time", e.target.value)
                  }
                  className="border p-1 rounded"
                />
                <span>to</span>
                <input
                  type="time"
                  value={w.closing_time}
                  onChange={(e) =>
                    updateTime(d.day, "closing_time", e.target.value)
                  }
                  className="border p-1 rounded"
                />
              </div>
            );
          })}
        </div>

        {/* KYC */}
        <input
          value={form.gst_number}
          onChange={(e) =>
            setForm({ ...form, gst_number: e.target.value })
          }
          placeholder="GST Number"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.fssai_number}
          onChange={(e) =>
            setForm({ ...form, fssai_number: e.target.value })
          }
          placeholder="FSSAI Number"
          className="w-full border p-2 rounded-xl"
        />

        <input
          value={form.pan_number}
          onChange={(e) =>
            setForm({ ...form, pan_number: e.target.value })
          }
          placeholder="PAN Number"
          className="w-full border p-2 rounded-xl"
        />

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Merchant"}
          </button>

          <button
            onClick={() => (window.location.href = "/admin/merchants")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
