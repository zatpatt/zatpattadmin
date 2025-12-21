import React, { useMemo, useState } from "react";
import { Search, CheckCircle, XCircle, Download } from "lucide-react";

/* ---------------- TAB DEFINITIONS ---------------- */
const TABS = [
  { key: "order_financials", label: "Order Financials" },
  { key: "dp_requests", label: "Delivery Partner Payout Requests" },
  { key: "merchant_requests", label: "Merchant Payout Requests" },
  { key: "dp_payouts", label: "Delivery Partner Payouts" },
  { key: "merchant_payouts", label: "Merchant Payouts" },
];

/* ---------------- ORDER DATA ---------------- */
const ORDER_FINANCIALS = [
  {
    id: "ORD1001",
    merchant: "Coffee House",
    partner: "Ravi",
    order_value: 500,
    commission: 50,
    delivery_charge: 40,
  },
  {
    id: "ORD1002",
    merchant: "Sweet Tooth",
    partner: "Ravi",
    order_value: 320,
    commission: 32,
    delivery_charge: 30,
  },
  {
    id: "ORD1003",
    merchant: "Snack Corner",
    partner: "Amit",
    order_value: 420,
    commission: 42,
    delivery_charge: 35,
  },
];

/* ---------------- OTHER DUMMY DATA ---------------- */
const DP_REQUESTS = [
  { id: 1, name: "Ravi Kumar", amount: 2400, type: "Weekly", status: "Pending" },
];
const MERCHANT_REQUESTS = [
  { id: 11, name: "Coffee House", amount: 12800, type: "Monthly", status: "Pending" },
];
const DP_PAYOUTS = [
  { id: 21, name: "Ravi Kumar", amount: 8200, period: "Monthly", status: "Paid" },
];
const MERCHANT_PAYOUTS = [
  { id: 31, name: "Coffee House", amount: 15400, period: "Monthly", status: "Paid" },
];

/* ---------------- CSV EXPORT ---------------- */
const exportCSV = (filename, rows) => {
  if (!rows.length) return alert("No data to export");
  const headers = Object.keys(rows[0]).join(",");
  const csv = [headers, ...rows.map(r => Object.values(r).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/* ================= COMPONENT ================= */
export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("order_financials");
  const [search, setSearch] = useState("");
  const [expandedPartner, setExpandedPartner] = useState(null);

  /* ---------------- GROUP BY DELIVERY PARTNER ---------------- */
  const groupedByPartner = useMemo(() => {
    const map = {};
    ORDER_FINANCIALS.forEach(o => {
      const totalPaid = o.order_value + o.delivery_charge;
      if (!map[o.partner]) {
        map[o.partner] = { orders: [], total: 0 };
      }
      map[o.partner].orders.push({ ...o, totalPaid });
      map[o.partner].total += totalPaid;
    });
    return map;
  }, []);

  const filterBySearch = (list) =>
    list.filter(x =>
      JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold">💰 Finance</h2>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSearch(""); setExpandedPartner(null); }}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === t.key ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SEARCH + EXPORT */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={() => exportCSV("order_financials.csv", ORDER_FINANCIALS)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ================= ORDER FINANCIALS ================= */}
      {activeTab === "order_financials" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">

          {/* SUMMARY BY DELIVERY PARTNER */}
          {Object.entries(groupedByPartner).map(([partner, data]) => (
            <div key={partner} className="border rounded-xl p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{partner}</div>
                  <div className="text-sm text-gray-500">
                    Orders: {data.orders.length}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total to Collect</div>
                  <div className="text-lg font-bold text-red-600">
                    ₹{data.total}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedPartner(
                        expandedPartner === partner ? null : partner
                      )
                    }
                    className="text-sm text-blue-600 mt-1"
                  >
                    {expandedPartner === partner ? "Hide Orders" : "View Orders"}
                  </button>
                </div>
              </div>

              {/* ORDER DETAILS */}
              {expandedPartner === partner && (
                <div className="mt-3 border-t pt-3 space-y-2">
                  {filterBySearch(data.orders).map(o => {
                    const merchantGets = o.order_value - o.commission;
                    return (
                      <div key={o.id} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="font-medium">{o.id}</div>
                        <div className="text-gray-600">
                          Merchant: {o.merchant}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-1">
                          <div>Order ₹{o.order_value}</div>
                          <div>Commission ₹{o.commission}</div>
                          <div className="text-green-600">Merchant Gets ₹{merchantGets}</div>
                          <div>Delivery ₹{o.delivery_charge}</div>
                          <div className="font-semibold">User Paid ₹{o.totalPaid}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
   
      {/* DP REQUESTS */}
      {activeTab === "dp_requests" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          {filterBySearch(dpRequests).map(r => (
            <div key={r.id} className="flex justify-between items-center border-b py-2">
              <div>{r.name} • {r.type} • ₹{r.amount}</div>
              <div className="flex gap-2">
                {r.status === "Pending" && (
                  <>
                    <button onClick={() => approveRequest(r.id, "dp")} className="text-green-600"><CheckCircle /></button>
                    <button onClick={() => rejectRequest(r.id, "dp")} className="text-red-600"><XCircle /></button>
                  </>
                )}
                <span>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MERCHANT REQUESTS */}
      {activeTab === "merchant_requests" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          {filterBySearch(merchantRequests).map(r => (
            <div key={r.id} className="flex justify-between items-center border-b py-2">
              <div>{r.name} • {r.type} • ₹{r.amount}</div>
              <div className="flex gap-2">
                {r.status === "Pending" && (
                  <>
                    <button onClick={() => approveRequest(r.id, "merchant")} className="text-green-600"><CheckCircle /></button>
                    <button onClick={() => rejectRequest(r.id, "merchant")} className="text-red-600"><XCircle /></button>
                  </>
                )}
                <span>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DP PAYOUTS */}
      {activeTab === "dp_payouts" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          {filterBySearch(DP_PAYOUTS).map(p => (
            <div key={p.id} className="flex justify-between border-b py-2">
              <div>{p.name} • {p.period}</div>
              <div className="text-green-600 font-medium">₹{p.amount}</div>
            </div>
          ))}
        </div>
      )}

      {/* MERCHANT PAYOUTS */}
      {activeTab === "merchant_payouts" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          {filterBySearch(MERCHANT_PAYOUTS).map(p => (
            <div key={p.id} className="flex justify-between border-b py-2">
              <div>{p.name} • {p.period}</div>
              <div className="text-green-600 font-medium">₹{p.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
