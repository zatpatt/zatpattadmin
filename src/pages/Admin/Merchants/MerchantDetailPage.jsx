// src/pages/Admin/MerchantDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
  getMerchants,
  updateMerchant,
} from "../../../services/merchantApi";

// demo orders (until backend API exists)
const ORDERS_KEY = "admin_orders_v1";

function loadOrdersForMerchant(id) {
  const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  return all.filter((o) => String(o.merchantId) === String(id));
}

export default function MerchantDetailPage() {
  const merchantId = window.location.pathname.split("/").pop();

  const [merchant, setMerchant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [workingHrs, setWorkingHrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 LOAD MERCHANT FROM BACKEND
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const list = await getMerchants();
        const m = list.find(
          (x) => String(x.merchant_id) === String(merchantId)
        );

        if (!m) {
          setMerchant(null);
          return;
        }

        setMerchant(m);
        setWorkingHrs(m.working_hrs || []);
        setOrders(loadOrdersForMerchant(merchantId));
      } catch (err) {
        console.error(err);
        alert("Failed to load merchant details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [merchantId]);

  // 🔹 TOGGLE BLOCK / UNBLOCK
  const toggleBlock = async () => {
    try {
      await updateMerchant({
        merchant_id: merchant.merchant_id,
        is_blocked: !merchant.is_blocked,
        name: merchant.name,
        phone: merchant.phone,
        owner_name: merchant.owner_name,
        email: merchant.email,
        address: merchant.address,
        city: merchant.city,
        state: merchant.state,
        pincode: merchant.pincode,
        category: merchant.category,
        commission_type: merchant.commission_type,
        commission_value: merchant.commission_value,
        gst_number: merchant.gst_number,
        fssai_number: merchant.fssai_number,
        pan_number: merchant.pan_number,
        working_hrs: workingHrs,
        is_verified: merchant.is_verified,
      });

      setMerchant((prev) => ({
        ...prev,
        is_blocked: !prev.is_blocked,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update block status");
    }
  };

  // 🔹 UPDATE WORKING HOURS
  const updateHours = async () => {
    try {
      await updateMerchant({
        merchant_id: merchant.merchant_id,
        name: merchant.name,
        phone: merchant.phone,
        owner_name: merchant.owner_name,
        email: merchant.email,
        address: merchant.address,
        city: merchant.city,
        state: merchant.state,
        pincode: merchant.pincode,
        category: merchant.category,
        commission_type: merchant.commission_type,
        commission_value: merchant.commission_value,
        gst_number: merchant.gst_number,
        fssai_number: merchant.fssai_number,
        pan_number: merchant.pan_number,
        working_hrs: workingHrs,
        is_verified: merchant.is_verified,
      });

      alert("Working hours updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update working hours");
    }
  };

  const fakeOrderMonitoring = () => {
    const fakeOrders = orders.filter(
      (o) => o.customer?.startsWith("FAKE")
    );
    alert(`Fake orders detected: ${fakeOrders.length}`);
  };

  if (loading) return <div className="p-6">Loading merchant…</div>;
  if (!merchant) return <div className="p-6">Merchant not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* MERCHANT INFO */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{merchant.name}</h3>
            <div className="text-sm text-gray-500">
              Owner: {merchant.owner_name || "—"} •{" "}
              {merchant.phone}
            </div>

            <div className="mt-2 text-sm">
              Active:{" "}
              <strong>{merchant.is_active ? "Yes" : "No"}</strong>
            </div>

            <div className="mt-2 text-sm">
              Blocked:{" "}
              <strong>{merchant.is_blocked ? "Yes" : "No"}</strong>
            </div>

            <div className="mt-2 text-sm">
              Commission: {merchant.commission_value || "—"}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={toggleBlock}
              className={`px-3 py-2 rounded ${
                merchant.is_blocked
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {merchant.is_blocked ? "Unblock" : "Block"}
            </button>

            <button
              onClick={updateHours}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
            >
              Update Working Hours
            </button>

            <button
              onClick={fakeOrderMonitoring}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Check Fake Orders
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS (DEMO) */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">Recent Orders</h4>
        {orders.length ? (
          orders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between py-2 border-b"
            >
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-sm text-gray-500">
                  {o.customer} • ₹{o.amount}
                </div>
              </div>
              <div className="text-sm">{o.status}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No orders found.</p>
        )}
      </div>

      {/* KYC */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">KYC Details</h4>
        <div className="text-sm text-gray-600">
          GST: {merchant.gst_number || "N/A"}
          <br />
          FSSAI: {merchant.fssai_number || "N/A"}
          <br />
          PAN: {merchant.pan_number || "N/A"}
        </div>
      </div>
    </div>
  );
}
