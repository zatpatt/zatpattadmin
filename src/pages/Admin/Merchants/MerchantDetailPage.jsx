// src/pages/Admin/MerchantDetailPage.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "admin_merchants_v2";
const ORDERS_KEY = "admin_orders_v1";

function loadMerchant(id) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.find(m => m.id === id);
}

function loadOrdersForMerchant(id) {
  const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  return all.filter(o => o.merchantId === id);
}

export default function MerchantDetailPage() {
  const id = window.location.pathname.split("/").pop();
  const [merchant, setMerchant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [operatingHours, setOperatingHours] = useState("");

  useEffect(() => {
    const m = loadMerchant(id);
    setMerchant(m);
    if (m) setOperatingHours(m.operatingHours || "9AM-9PM");
    setOrders(loadOrdersForMerchant(id));
  }, [id]);

  const toggleBlock = () => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = all.map(m => m.id === id ? { ...m, blocked: !m.blocked } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMerchant(updated.find(m => m.id === id));
  };

  const updateHours = () => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = all.map(m => m.id === id ? { ...m, operatingHours } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMerchant(updated.find(m => m.id === id));
    alert("Operating hours updated");
  };

  const fakeOrderMonitoring = () => {
    const fakeOrders = orders.filter(o => o.customer.startsWith("FAKE"));
    alert(`Fake orders detected: ${fakeOrders.length}`);
  };

  if (!merchant) return <div className="p-6">Merchant not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{merchant.name}</h3>
            <div className="text-sm text-gray-500">Owner: {merchant.owner} • {merchant.phone}</div>
            <div className="mt-2 text-sm">Status: <strong>{merchant.status}</strong></div>
            <div className="mt-2 text-sm">Blocked: <strong>{merchant.blocked ? "Yes" : "No"}</strong></div>
            <div className="mt-2 text-sm">Commission: {merchant.commission}%</div>
            <div className="mt-2 text-sm">Operating Hours: {merchant.operatingHours}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={toggleBlock} className={`px-3 py-2 rounded ${merchant.blocked ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{merchant.blocked ? "Unblock" : "Block"}</button>
            <input value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="border px-2 py-1 rounded text-sm"/>
            <button onClick={updateHours} className="bg-orange-500 text-white px-3 py-1 rounded text-sm">Update Hours</button>
            <button onClick={fakeOrderMonitoring} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Check Fake Orders</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">Recent Orders</h4>
        {orders.length ? orders.map(o => (
          <div key={o.id} className="flex justify-between py-2 border-b">
            <div>
              <div className="font-medium">{o.id}</div>
              <div className="text-sm text-gray-500">{o.customer} • ₹{o.amount}</div>
            </div>
            <div className="text-sm">{o.status}</div>
          </div>
        )) : <p className="text-gray-400">No orders found.</p>}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">KYC & Shop Images</h4>
        <div className="text-sm text-gray-600">
          GST: {merchant.gst || "N/A"}<br/>
          FSSAI: {merchant.fssai || "N/A"}<br/>
          PAN: {merchant.pan || "N/A"}
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {merchant.shopImages?.map((img,i) => (
            <img key={i} src={img} alt="shop" className="w-20 h-20 object-cover rounded"/>
          ))}
          {!merchant.shopImages?.length && <div className="text-gray-400 p-2">No shop images</div>}
        </div>
      </div>
    </div>
  );
}
