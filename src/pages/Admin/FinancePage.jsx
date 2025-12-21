import React, { useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

/* ---------------- TAB DEFINITIONS ---------------- */
const TABS = [
  { key: "order_financials", label: "Order Financials" },
  { key: "dp_requests", label: "Delivery Partner Payout Requests" },
  { key: "merchant_requests", label: "Merchant Payout Requests" },
  { key: "dp_payouts", label: "Delivery Partner Payouts" },
  { key: "merchant_payouts", label: "Merchant Payouts" },
];

/* ---------------- DUMMY DATA ---------------- */
// ✅ UPDATED STRUCTURE
const ORDER_FINANCIALS = [
  {
    id: "ORD1001",
    merchant: "Coffee House",
    partner: "Ravi",
    order_value: 500,
    commission: 50,
    delivery_charge: 40,
    status: "Delivered",
  },
  {
    id: "ORD1002",
    merchant: "Sweet Tooth",
    partner: "Amit",
    order_value: 320,
    commission: 32,
    delivery_charge: 30,
    status: "Delivered",
  },
];

const DP_REQUESTS = [
  { id: 1, name: "Ravi Kumar", amount: 2400, type: "Weekly", status: "Pending" },
  { id: 2, name: "Amit Patil", amount: 9100, type: "Monthly", status: "Pending" },
];

const MERCHANT_REQUESTS = [
  { id: 11, name: "Coffee House", amount: 12800, type: "Monthly", status: "Pending" },
  { id: 12, name: "Sweet Tooth", amount: 4200, type: "Weekly", status: "Pending" },
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
  const csv = [
    headers,
    ...rows.map((r) => Object.values(r).join(",")),
  ].join("\n");

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

  const [dpRequests, setDpRequests] = useState(DP_REQUESTS);
  const [merchantRequests, setMerchantRequests] = useState(MERCHANT_REQUESTS);

  /* ---------------- SUMMARY CARDS ---------------- */
  const summary = useMemo(() => {
    const paid =
      DP_PAYOUTS.reduce((s, x) => s + x.amount, 0) +
      MERCHANT_PAYOUTS.reduce((s, x) => s + x.amount, 0);

    const pending =
      dpRequests.reduce((s, x) => s + x.amount, 0) +
      merchantRequests.reduce((s, x) => s + x.amount, 0);

    return {
      totalPaid: paid,
      pendingRequests: pending,
      totalRequests: dpRequests.length + merchantRequests.length,
    };
  }, [dpRequests, merchantRequests]);

  /* ---------------- ACTIONS ---------------- */
  const approveRequest = (id, type) => {
    if (type === "dp") {
      setDpRequests(dpRequests.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    } else {
      setMerchantRequests(merchantRequests.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    }
  };

  const rejectRequest = (id, type) => {
    if (type === "dp") {
      setDpRequests(dpRequests.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    } else {
      setMerchantRequests(merchantRequests.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    }
  };

  const filterBySearch = (list) =>
    list.filter((x) =>
      JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold">💰 Finance</h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Total Paid</div>
          <div className="text-2xl font-bold text-green-600">₹{summary.totalPaid}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Pending Requests</div>
          <div className="text-2xl font-bold text-orange-500">₹{summary.pendingRequests}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-bold">{summary.totalRequests}</div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSearch(""); }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === t.key
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={() =>
            exportCSV(
              `${activeTab}.csv`,
              activeTab === "order_financials" ? ORDER_FINANCIALS :
              activeTab === "dp_requests" ? dpRequests :
              activeTab === "merchant_requests" ? merchantRequests :
              activeTab === "dp_payouts" ? DP_PAYOUTS :
              MERCHANT_PAYOUTS
            )
          }
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ================= ORDER FINANCIALS (FIXED) ================= */}
      {activeTab === "order_financials" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          {filterBySearch(ORDER_FINANCIALS).map(o => {
            const merchantGets = o.order_value - o.commission;
            const totalPaidByUser = o.order_value + o.delivery_charge;

            return (
              <div key={o.id} className="border-b pb-3">
                <div className="font-medium">{o.id}</div>
                <div className="text-sm text-gray-500">
                  Merchant: {o.merchant} • Delivery Partner: {o.partner}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2 text-sm">
                  <div>
                    Order Value<br />
                    <b>₹{o.order_value}</b>
                  </div>
                  <div>
                    Commission<br />
                    <b className="text-red-600">- ₹{o.commission}</b>
                  </div>
                  <div>
                    Merchant Gets<br />
                    <b className="text-green-600">₹{merchantGets}</b>
                  </div>
                  <div>
                    Delivery Charge (Customer)<br />
                    <b>₹{o.delivery_charge}</b>
                  </div>
                  <div>
                    Total Paid by User<br />
                    <b className="text-blue-600">₹{totalPaidByUser}</b>
                  </div>
                </div>
              </div>
            );
          })}
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
