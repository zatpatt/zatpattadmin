// src/pages/Admin/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Sample data
const revenueData = [
  { day: "Mon", revenue: 1200, orders: 24 },
  { day: "Tue", revenue: 2100, orders: 42 },
  { day: "Wed", revenue: 800, orders: 15 },
  { day: "Thu", revenue: 1900, orders: 36 },
  { day: "Fri", revenue: 2400, orders: 50 },
  { day: "Sat", revenue: 3000, orders: 60 },
  { day: "Sun", revenue: 1700, orders: 30 },
];

const topItems = [
  { item: "Milk", sold: 540 },
  { item: "Bread", sold: 420 },
  { item: "Eggs", sold: 380 },
  { item: "Bananas", sold: 350 },
  { item: "Chicken", sold: 310 },
];

// Mock live orders
const liveOrders = [
  { id: "ORD101", customer: "Rahul", amount: 220, status: "On the Way" },
  { id: "ORD102", customer: "Priya", amount: 180, status: "Preparing" },
];

// Mock pending refunds
const pendingRefunds = [
  { id: "ORD201", customer: "Amit", amount: 150, reason: "Wrong Item" },
];

export default function DashboardPage() {
  const [orders] = useState(revenueData);
  const [activeCustomers] = useState(325); // Mock active customers
  const [activeMerchants] = useState(89);
  const [deliveryPartners] = useState(143);
  const [totalRevenue] = useState(841200);
  const [totalCommission] = useState(212900);

  // Calculate AOV
  const totalOrders = orders.reduce((acc, o) => acc + o.orders, 0);
  const totalRevenueSum = orders.reduce((acc, o) => acc + o.revenue, 0);
  const aov = totalOrders ? (totalRevenueSum / totalOrders).toFixed(2) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">

      {/* ==== TOP STATS ROW 1 ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Orders (Today)</div>
          <div className="mt-2 text-2xl font-bold">{totalOrders}</div>
          <div className="text-xs text-green-600 mt-2">+12% vs yesterday</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="mt-2 text-2xl font-bold">₹ {totalRevenue}</div>
          <div className="text-xs text-green-600 mt-2">+10% growth</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Average Order Value (AOV)</div>
          <div className="mt-2 text-2xl font-bold">₹ {aov}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Active Customers</div>
          <div className="mt-2 text-2xl font-bold">{activeCustomers}</div>
        </div>
      </div>

      {/* ==== TOP STATS ROW 2 ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Active Merchants</div>
          <div className="mt-2 text-2xl font-bold">{activeMerchants}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Delivery Partners</div>
          <div className="mt-2 text-2xl font-bold">{deliveryPartners}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Commission Earned</div>
          <div className="mt-2 text-2xl font-bold">₹ {totalCommission}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Pending Refunds</div>
          <div className="mt-2 text-2xl font-bold">{pendingRefunds.length}</div>
        </div>
      </div>

      {/* ==== REVENUE CHART ==== */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Revenue (Last 7 Days)</h3>
          <div className="text-sm text-gray-500">Amount in ₹</div>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== ORDERS TREND CHART ==== */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Orders Trend (Last 7 Days)</h3>
          <div className="text-sm text-gray-500">Orders count</div>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== TOP SELLING ITEMS ==== */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Top Selling Items</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems}>
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== PEAK ORDER TIME ==== */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Peak Order Time</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { time: "8AM", orders: 120 },
              { time: "11AM", orders: 260 },
              { time: "2PM", orders: 200 },
              { time: "5PM", orders: 310 },
              { time: "9PM", orders: 380 },
            ]}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#fb923c" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== LIVE ORDERS ==== */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3">Live Orders</h3>
        <ul className="space-y-2 text-sm">
          {liveOrders.map(o => (
            <li key={o.id} className="flex justify-between">
              <span>{o.customer} ({o.id})</span>
              <span className="text-orange-600">{o.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ==== APP PERFORMANCE METRICS ==== */}
      <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-2">App Performance Metrics</h3>
        <p>(Coming Soon — real-time data required)</p>
        <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">Performance Preview</span>
        </div>
      </div>

      {/* ==== HEATMAP PLACEHOLDER ==== */}
      <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-2">Location Heatmap</h3>
        <p>(Coming Soon — backend required)</p>
        <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">Heatmap Preview</span>
        </div>
      </div>

    </div>
  );
}
