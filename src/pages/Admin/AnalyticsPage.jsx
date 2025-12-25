//src\pages\Admin\AnalyticsPage.jsx

import React, { useEffect, useState } from "react";
import {
  getTotalEarning,
  getMerchantEarning,
  getTopItems,
} from "../../services/analyticsApi";

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [totalEarning, setTotalEarning] = useState([]);
  const [merchantEarning, setMerchantEarning] = useState([]);
  const [topItems, setTopItems] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ALL ANALYTICS ---------------- */
  const fetchAnalytics = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      const payload = { start_date: fromDate, end_date: toDate };

      const [earningRes, merchantRes, itemRes] = await Promise.all([
        getTotalEarning(payload),
        getMerchantEarning(payload),
        getTopItems(payload),
      ]);

      if (earningRes?.status) setTotalEarning(earningRes.data || []);
      if (merchantRes?.status) setMerchantEarning(merchantRes.data || []);
      if (itemRes?.status) setTopItems(itemRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DEFAULT TODAY ---------------- */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate]);

               /*------------- UI ------------- */

  return (
    <div className="space-y-6">

      {/* DATE FILTER */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="text-sm text-gray-500">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading analytics...</div>
      )}

      {/* ---------------- TOTAL EARNING ---------------- */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">📊 Daily Total Earnings</h3>

        {totalEarning.length === 0 ? (
          <p className="text-sm text-gray-500">No data</p>
        ) : (
  <table className="w-full border-2 border-gray-600 border-collapse rounded-lg overflow-hidden">
  <thead className="bg-gray-100">
    <tr className="text-sm font-semibold text-gray-700">
      <th className="border border-gray-500 px-4 py-2 font-bold text-center">Date</th>
      <th className="border border-gray-500 px-4 py-2 font-bold text-center">Orders</th>
      <th className="border border-gray-500 px-4 py-2 font-bold text-center">Amount (₹)</th>
    </tr>
  </thead>

  <tbody>
    {totalEarning.map((d, idx) => (
      <tr
        key={d.date}
        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
      >
       <td className="border border-gray-500 px-4 py-2 text-center font-medium">
          {d.date}
        </td>
        <td className="border border-gray-500 px-4 py-2 text-center">
        {d.total_orders}
        </td>
       <td className="border border-gray-500 px-4 py-2 text-center font-bold text-green-600">
          ₹{d.total_amount}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}
      </div>

      {/* ---------------- MERCHANT EARNING ---------------- */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">🏪 Merchant Earnings</h3>

  <table className="w-full border-2 border-gray-600 border-collapse rounded-lg overflow-hidden">
  <thead className="bg-gray-100">
    <tr className="text-sm font-semibold text-gray-700">
    <th className="border border-gray-500 px-4 py-2 font-bold text-left">Merchant</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Orders</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Gross (₹)</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Commission (₹)</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Net (₹)</th>
    </tr>
  </thead>

  <tbody>
    {merchantEarning.map((m, idx) => (
      <tr
        key={m.merchant_id}
        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
      >
      <td className="border border-gray-500 px-4 py-2 font-medium">
          {m.merchant_name}
        </td>

        <td className="border border-gray-500 px-4 py-2 text-center">
        {m.total_orders}
        </td>

       <td className="border border-gray-500 px-4 py-2 text-center font-semibold">
          ₹{m.gross_amount}
        </td>

       <td className="border border-gray-500 px-4 py-2 text-center text-red-600 font-medium">
          ₹{m.total_commission}
        </td>

        <td
          className={`border px-4 py-2 text-center font-bold ${
            Number(m.net_amount) < 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          ₹{m.net_amount}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>

      {/* ---------------- TOP ITEMS ---------------- */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">🔥 Top Selling Items</h3>

  <table className="w-full border-2 border-gray-600 border-collapse rounded-lg overflow-hidden">
  <thead className="bg-gray-100">
    <tr className="text-sm font-semibold text-gray-700">
    <th className="border border-gray-500 px-4 py-2 font-bold text-left">Item Name</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Quantity</th>
    <th className="border border-gray-500 px-4 py-2 font-bold text-center">Revenue (₹)</th>
    </tr>
  </thead>

  <tbody>
    {topItems.map((i, idx) => (
      <tr
        key={i.item_id}
        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
      >
       <td className="border border-gray-500 px-4 py-2 font-medium">
          {i.item_name}
        </td>

        <td className="border border-gray-500 px-4 py-2 text-center">
        {i.total_quantity}
        </td>

       <td className="border border-gray-500 px-4 py-2 text-center font-semibold">
          ₹{i.total_revenue ?? 0}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>

    </div>
  );
}
