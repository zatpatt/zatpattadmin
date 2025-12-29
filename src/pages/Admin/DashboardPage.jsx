import React, { useEffect, useState } from "react";
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

import {
  getDashboardValues,
  getDashboardCharts,
} from "../../services/dashboardApi";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  /* ================= STATS ================= */
  const [stats, setStats] = useState({});

  /* ================= CHART DATA ================= */
  const [charts, setCharts] = useState({
    orders_per_date: [],
    revenue_per_date: [],
    top_selling_items: [],
    peak_order_hour: [],
  });

  /* ================= GLOBAL DATE RANGE ================= */
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    const res = await getDashboardValues({});
    if (res?.status) {
      const row = Array.isArray(res.data) ? res.data[0] : res.data;
      setStats(row || {});
    }
  };

  /* ================= FETCH ALL CHARTS ================= */
  const fetchCharts = async () => {
    setLoading(true);
    try {
      const payload = {};

      // send dates only if selected
      if (dateRange.start_date) payload.start_date = dateRange.start_date;
      if (dateRange.end_date) payload.end_date = dateRange.end_date;

      const res = await getDashboardCharts(payload);
      if (!res?.status) return;

      const data = res.data || {};

      setCharts({
        orders_per_date: data.total_orders || [],
        revenue_per_date: data.revenue_per_date || [],
        top_selling_items: data.top_selling_items || [],
        peak_order_hour: data.peak_order_hour || [],
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchStats();
    fetchCharts(); // empty payload → backend returns TODAY data
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Today’s Orders" value={stats.today_orders ?? 0} />
        <StatCard title="Total Orders" value={stats.total_orders ?? 0} />
        <StatCard title="Today’s Revenue" value={`₹ ${stats.today_revenue ?? 0}`} />
        <StatCard title="Total Revenue" value={`₹ ${stats.total_revenue ?? 0}`} />
        <StatCard title="Today’s Commission" value={`₹ ${stats.todays_commission ?? 0}`} />
        <StatCard title="Total Commission" value={`₹ ${stats.total_commision_earned ?? 0}`} />
      </div>

      {/* ================= GLOBAL DATE FILTER ================= */}
      <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center flex-wrap gap-3">
       
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, start_date: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, end_date: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <button
            onClick={fetchCharts}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ================= ORDERS TREND ================= */}
      <ChartSection title="Orders Trend" dataLength={charts.orders_per_date.length}>
        <LineChart data={charts.orders_per_date}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="count" stroke="#f97316" strokeWidth={3} />
        </LineChart>
      </ChartSection>

      {/* ================= REVENUE ================= */}
      <ChartSection title="Revenue" dataLength={charts.revenue_per_date.length}>
        <BarChart data={charts.revenue_per_date}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#fb923c" />
        </BarChart>
      </ChartSection>

      {/* ================= TOP SELLING ITEMS ================= */}
      <ChartSection title="Top Selling Items" dataLength={charts.top_selling_items.length}>
        <BarChart data={charts.top_selling_items}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity_sold" fill="#f97316" />
        </BarChart>
      </ChartSection>

      {/* ================= PEAK ORDER TIME ================= */}
      <ChartSection title="Peak Order Time" dataLength={charts.peak_order_hour.length}>
        <LineChart data={charts.peak_order_hour}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="count" stroke="#fb923c" strokeWidth={3} />
        </LineChart>
      </ChartSection>

    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function ChartSection({ title, children, dataLength }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <ChartWrapper dataLength={dataLength}>{children}</ChartWrapper>
    </div>
  );
}

function ChartWrapper({ children, dataLength }) {
  return (
    <div className="w-full min-w-0">
      {dataLength > 0 ? (
        <ResponsiveContainer width="100%" aspect={3}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      )}
    </div>
  );
}
