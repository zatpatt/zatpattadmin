//src\pages\Admin\FinancePage.jsx

import React, { useMemo, useState, useEffect } from "react";
import {
  getDeliveryPartnerPayout,
  getDeliveryPartnerPaymentRequests,
  updatePartnerPaymentRequest,
  updatePartnerPaymentProcess,
  getMerchantPayout,
  getMerchantPaymentRequests,
  updateMerchantPaymentRequest,
  updateMerchantPaymentProcess,
  getCollectionFromDeliveryPartner,
  updateCollectionStatus,
} from "../../services/financeApi";
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

const DP_REQUESTS = [
  { id: 1, name: "Ravi Kumar", amount: 2400, type: "Weekly", status: "Pending" },
  { id: 2, name: "Amit Patil", amount: 9100, type: "Monthly", status: "Pending" },
];

const MERCHANT_REQUESTS = [
  { id: 11, name: "Coffee House", amount: 12800, type: "Monthly", status: "Pending" },
  { id: 12, name: "Sweet Tooth", amount: 4200, type: "Weekly", status: "Pending" },
];

const DP_PAYOUTS = [
  { id: 21, name: "Ravi Kumar", amount: 8200, period: "Monthly", date: "2025-02-10" },
  { id: 22, name: "Amit Patil", amount: 6500, period: "Weekly", date: "2025-02-14" },
];

const MERCHANT_PAYOUTS = [
  { id: 31, name: "Coffee House", amount: 15400, period: "Monthly", date: "2025-02-09" },
  { id: 32, name: "Sweet Tooth", amount: 8200, period: "Weekly", date: "2025-02-15" },
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
  const [expandedPartner, setExpandedPartner] = useState(null);

  const [dpRequestApiData, setDpRequestApiData] = useState([]);
  const [loadingDpRequests, setLoadingDpRequests] = useState(false);

  const [approvedDpRequests, setApprovedDpRequests] = useState([]);
  const [rejectedDpRequests, setRejectedDpRequests] = useState([]);
  const [paidDpRequests, setPaidDpRequests] = useState([]);

  const [approvedMerchantRequests, setApprovedMerchantRequests] = useState([]);
  const [rejectedMerchantRequests, setRejectedMerchantRequests] = useState([]);
  const [paidMerchantRequests, setPaidMerchantRequests] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [dpRequests, setDpRequests] = useState(DP_REQUESTS);
  const [merchantRequests, setMerchantRequests] = useState(MERCHANT_REQUESTS);

  const [dpPayoutApiData, setDpPayoutApiData] = useState([]);
  const [loadingDpPayouts, setLoadingDpPayouts] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentContext, setPaymentContext] = useState(null); 
    // { type: "dp" | "merchant", requestId, name, amount }

  const [paymentMode, setPaymentMode] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [merchantRequestApiData, setMerchantRequestApiData] = useState([]);
  const [merchantPayoutApiData, setMerchantPayoutApiData] = useState([]);
  const [loadingmerchantRequests, setLoadingmerchantRequests] = useState(false);
  const [loadingmerchantPayout, setLoadingmerchantPayout] = useState(false);

  const [dpCollectionApiData, setDpCollectionApiData] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const [showCollectModal, setShowCollectModal] = useState(false);
  const [collectContext, setCollectContext] = useState(null);
  // { delivery_id, amount }

  
  /* ---------------- GROUP BY DELIVERY PARTNER ---------------- */
  // const groupedByPartner = useMemo(() => {
  //   const map = {};
  //   ORDER_FINANCIALS.forEach(o => {
  //     const totalPaid = o.order_value + o.delivery_charge;
  //     if (!map[o.partner]) {
  //       map[o.partner] = { orders: [], total: 0 };
  //     }
  //     map[o.partner].orders.push({ ...o, totalPaid });
  //     map[o.partner].total += totalPaid;
  //   });
  //   return map;
  // }, []);

  const isSubmitDisabled =
  !paymentMode ||
  (paymentMode === "upi" && !transactionId.trim());

const filterByDateRange = (list) => {
  if (!fromDate && !toDate) return list;

  return list.filter((item) => {
    if (!item.date) return false;

    const itemDate = new Date(item.date);

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (to) to.setHours(23, 59, 59, 999);

    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;

    return true;
  });
};

const openPaymentPopup = (ctx) => {
  setPaymentContext(ctx);
  setPaymentMode("");
  setTransactionId("");
  setShowPaymentModal(true);
};

const closePaymentPopup = () => {
  setShowPaymentModal(false);
  setPaymentContext(null);
  setPaymentMode("");
  setTransactionId("");
};

const submitPayment = () => {
  
  if (paymentContext?.type === "dp") {
    updatePartnerPaymentProcess({
      payment_id: paymentContext.requestId,
      payment_mode: paymentMode,
     transaction_id: paymentMode === "upi" ? transactionId : "cash",
    }).then(() => {
      setPaidDpRequests((prev) => [...prev, paymentContext.requestId]);
      closePaymentPopup();
    });
  }

  if (paymentContext?.type === "merchant") {
          updateMerchantPaymentProcess({
        payment_id: paymentContext.requestId,
        payment_mode: paymentMode,
        transaction_id: paymentMode === "upi" ? transactionId : "cash",
      }).then(() => {
      setPaidMerchantRequests((prev) => [...prev, paymentContext.requestId]);
      closePaymentPopup();
    });
  }
};

  /* ---------------- SUMMARY CARDS ---------------- */
 const summary = useMemo(() => {
  const dpPaid = dpPayoutApiData.reduce(
    (s, x) => s + Number(x.total_amount || 0),
    0
  );

  const merchantPaid = merchantPayoutApiData.reduce(
    (s, x) => s + Number(x.total_amount || 0),
    0
  );

  const dpPending = dpRequestApiData.reduce(
    (s, x) => s + Number(x.total_amount || 0),
    0
  );

  const merchantPending = merchantRequestApiData.reduce(
    (s, x) => s + Number(x.total_amount || 0),
    0
  );

  return {
    totalPaid: dpPaid + merchantPaid,
    pendingRequests: dpPending + merchantPending,
    totalRequests:
      dpRequestApiData.length + merchantRequestApiData.length,
  };
}, [
  dpPayoutApiData,
  merchantPayoutApiData,
  dpRequestApiData,
  merchantRequestApiData,
]);

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

    useEffect(() => {
  if (activeTab !== "dp_payouts") return;
  if (!fromDate || !toDate) return;

  setLoadingDpPayouts(true);

  getDeliveryPartnerPayout({
    start_date: fromDate,
    end_date: toDate,
  })
    .then((res) => {
      if (res?.status) {
        setDpPayoutApiData(res.data || []);
      }
    })
    .catch(() => {
      setDpPayoutApiData([]);
    })
    .finally(() => setLoadingDpPayouts(false));
}, [activeTab, fromDate, toDate]);

useEffect(() => {
  if (activeTab !== "dp_requests") return;

  setLoadingDpRequests(true);

  getDeliveryPartnerPaymentRequests()
    .then((res) => {
      if (res?.status) {
        setDpRequestApiData(res.data || []);
      }
    })
    .catch(() => {
      setDpRequestApiData([]);
    })
    .finally(() => setLoadingDpRequests(false));
}, [activeTab]);

useEffect(() => {
  if (activeTab !== "merchant_requests") return;

   setLoadingmerchantRequests(true);

   getMerchantPaymentRequests()
    .then((res) => {
    if (res?.status) {
      setMerchantRequestApiData(res.data || []);
    }
  })
  .catch(() => {
      setMerchantRequestApiData([]);
    })
    .finally(() => setLoadingmerchantRequests(false));
}, [activeTab]);

useEffect(() => {
  if (activeTab !== "merchant_payouts") return;
  if (!fromDate || !toDate) return;

   setLoadingmerchantPayout(true);

  getMerchantPayout({
    start_date: fromDate, 
    end_date: toDate 
  })
    .then((res) => {
     if (res?.status) {
        setMerchantPayoutApiData(res.data || []);
          }
    })
    .catch(() => {
      setMerchantPayoutApiData([]);
    })
    .finally(() => setLoadingmerchantPayout(false));
       }, [activeTab, fromDate, toDate]);

useEffect(() => {
  if (activeTab !== "order_financials") return;

  setLoadingCollections(true);

  getCollectionFromDeliveryPartner()
    .then((res) => {
      if (res?.status) {
        setDpCollectionApiData(res.data || []);
      }
    })
    .catch(() => {
      setDpCollectionApiData([]);
    })
    .finally(() => setLoadingCollections(false));
}, [activeTab]);

useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  setFromDate(today);
  setToDate(today);
}, []);

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
              activeTab === "order_financials" ? dpCollectionApiData :
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

{/* DATE RANGE FILTER – ONLY FOR PAYOUT TABS */}
{(activeTab === "dp_payouts" || activeTab === "merchant_payouts") && (
  <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-center">
    <div className="flex flex-col text-sm">
      <label className="text-gray-500">From Date</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
    </div>

    <div className="flex flex-col text-sm">
      <label className="text-gray-500">To Date</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
    </div>

    {(fromDate || toDate) && (
      <button
        onClick={() => {
          setFromDate("");
          setToDate("");
        }}
        className="mt-5 text-sm text-red-600 underline"
      >
        Clear Dates
      </button>
    )}
  </div>
)}

   {/* ================= ORDER FINANCIALS ================= */}
      {activeTab === "order_financials" && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">

          {/* SUMMARY BY DELIVERY PARTNER */}
         {loadingCollections && (
  <div className="text-sm text-gray-500">Loading collections...</div>
)}

{!loadingCollections && dpCollectionApiData.length === 0 && (
  <div className="text-sm text-gray-500">No collection data found</div>
)}

{dpCollectionApiData.map((d) => (
  <div key={d.delivery_id} className="border rounded-xl p-3">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium">{d.full_name}</div>
        <div className="text-sm text-gray-500">
          Orders: {d.total_orders}
        </div>
      </div>

      <div className="text-right">
  <div className="text-sm text-gray-500">Total to Collect</div>

  <div className="text-lg font-bold text-red-600">
    ₹{d.total_amount}
  </div>

  {!d.is_collected ? (
    <button
  onClick={() => {
    setCollectContext({
      delivery_id: d.delivery_id,
      amount: d.total_amount,
    });
    setShowCollectModal(true);
  }}
  className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
>
  Mark as Collected
</button>
  ) : (
    <div className="mt-2 text-sm text-green-600 font-semibold">
      ✓ Collected
    </div>
  )}

  {d.order_details.length > 0 && (
    <button
      onClick={() =>
        setExpandedPartner(
          expandedPartner === d.delivery_id ? null : d.delivery_id
        )
      }
      className="text-sm text-blue-600 mt-1"
    >
      {expandedPartner === d.delivery_id
        ? "Hide Orders"
        : "View Orders"}
    </button>
  )}
</div>

    </div>

    {/* ORDER DETAILS */}
    {expandedPartner === d.delivery_id && (
      <div className="mt-3 border-t pt-3 space-y-2">
        {d.order_details.map((o, idx) => (
          <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
            <div className="font-medium">{o.order_code}</div>
            <div className="text-gray-600">
              Merchant: {o.merchant_name}
            </div>
            <div className="font-semibold">
              ₹{o.total_amount}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
))}
        </div>
      )}
      
   {/* DP REQUESTS */}
{activeTab === "dp_requests" && (
  <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      {filterBySearch(dpRequestApiData).map((r) => {
      const isApproved = approvedDpRequests.includes(r.payment_id);
      const isRejected = rejectedDpRequests.includes(r.id);
      const isPaid = paidDpRequests.includes(r.payment_id);

      return (
        <div
          key={r.id}
          className="flex justify-between items-center border-b py-2"
        >
          <div>
           {r.full_name} • ₹{r.total_amount}
          </div>

          <div className="flex items-center gap-2">
            {/* APPROVE */}
            {!isApproved && !isRejected && (
              <button
              onClick={() =>
              updatePartnerPaymentRequest({
                payment_id: r.payment_id,
                request_status: "approved",
              }).then((res) => {
                if (!res?.status) {
                  alert(res?.message || "Approval failed");
                  return;
                }

                setApprovedDpRequests((prev) => [...prev, r.payment_id]);
              })
            }
            className="p-2 rounded bg-orange-100 text-orange-600"
              title="Approve"
              >
                <CheckCircle size={18} />
              </button>
            )}

            {/* REJECT */}
            {!isApproved && !isRejected && (
              <button
                onClick={() =>
                  setRejectedDpRequests((prev) => [...prev, r.id])
                }
                className="p-2 rounded bg-red-100 text-red-600"
                title="Reject"
              >
                <XCircle size={18} />
              </button>
            )}

            {/* MARK AS PAID */}
            {isApproved && !isPaid && (
              <button
            onClick={() =>
            openPaymentPopup({
            type: "dp",
            requestId: r.payment_id,   // ✅ MUST BE payment_id
            name: r.full_name,
            amount: r.total_amount,
          })
            }
            className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
          >
            Accept & Pay
          </button>
                    )}

            {/* FINAL STATE */}
            {isPaid && (
              <span className="text-green-600 font-semibold">
                ✓ Paid
              </span>
            )}

            {isRejected && (
              <span className="text-red-600 font-semibold">
                ✕ Rejected
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}

{/* MERCHANT REQUESTS */}
{activeTab === "merchant_requests" && (
  <div className="bg-white rounded-2xl shadow p-4 space-y-3">
    {filterBySearch(merchantRequestApiData).map((r) => {
      const isApproved = approvedMerchantRequests.includes(r.payment_id);
      const isRejected = rejectedMerchantRequests.includes(r.id);
      const isPaid = paidMerchantRequests.includes(r.payment_id);

      return (
        <div
          key={r.id}
          className="flex justify-between items-center border-b py-2"
        >
          <div>
            {r.name} • ₹{r.total_amount}
          </div>

          <div className="flex items-center gap-2">
            {/* APPROVE */}
            {!isApproved && !isRejected && (
              <button
                onClick={() =>
                updateMerchantPaymentRequest({
                  payment_id: r.payment_id,
                  request_status: "approved",
                }).then((res) => {
                  if (!res?.status) {
                    alert(res?.message || "Approval failed");
                    return;
                  }

                  setApprovedMerchantRequests((prev) => [...prev, r.payment_id]);
                })
              }
                className="p-2 rounded bg-orange-100 text-orange-600"
                title="Approve"
              >
                <CheckCircle size={18} />
              </button>
            )}

            {/* REJECT */}
            {!isApproved && !isRejected && (
              <button
                onClick={() =>
                  setRejectedMerchantRequests((prev) => [...prev, r.id])
                }
                className="p-2 rounded bg-red-100 text-red-600"
                title="Reject"
              >
                <XCircle size={18} />
              </button>
            )}

            {/* MARK AS PAID */}
            {isApproved && !isPaid && (
              <button
                onClick={() =>
                  openPaymentPopup({
                    type: "merchant",
                    requestId: r.payment_id,
                    name: r.name,
                    amount: r.total_amount,
                  })
                }
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Accept & Pay
              </button>
            )}

            {/* FINAL STATE */}
            {isPaid && (
              <span className="text-green-600 font-semibold">
                ✓ Paid
              </span>
            )}

            {isRejected && (
              <span className="text-red-600 font-semibold">
                ✕ Rejected
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}


{/* DELIVERY PARTNER PAYOUTS */}
 {activeTab === "dp_payouts" && (
  <div className="bg-white rounded-2xl shadow p-4 space-y-3">
    {loadingDpPayouts && (
      <div className="text-sm text-gray-500">Loading payouts...</div>
    )}

    {!loadingDpPayouts && dpPayoutApiData.length === 0 && (
      <div className="text-sm text-gray-500">
        No payouts found for selected dates
      </div>
    )}

    {dpPayoutApiData.map((p, index) => (
      <div
        key={index}
        className="flex justify-between items-center border-b py-2"
      >
        <div>
          <div className="font-medium">{p.full_name}</div>
          <div className="text-xs text-gray-500">
            📞 {p.phone} • Orders: {p.total_orders}
          </div>
        </div>

        <div className="text-green-600 font-semibold">
          ₹{p.total_amount}
        </div>
      </div>
    ))}
  </div>
)}

{/* MERCHANT PAYOUTS */}
{activeTab === "merchant_payouts" && (
  <div className="bg-white rounded-2xl shadow p-4 space-y-3">
   {filterBySearch(merchantPayoutApiData).map((p, idx) => (
  <div
    key={`${p.name}-${idx}`}   // ✅ guaranteed unique
    className="flex justify-between border-b py-2"
  >
      <div>
  <div className="font-medium">{p.name}</div>
  <div className="text-xs text-gray-500">
    📞 {p.phone} • Orders: {p.total_orders}
  </div>
</div>
<div className="text-green-600 font-semibold">
  ₹{p.total_amount}
</div>
      </div>
    ))}
  </div>
)}
{showPaymentModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5 space-y-4">
      <h3 className="text-lg font-semibold">Confirm Payment</h3>

      <div className="text-sm text-gray-600">
        {paymentContext?.name} • ₹{paymentContext?.amount}
      </div>

      {/* PAYMENT MODE */}
      <div>
        <label className="text-sm text-gray-500">Payment Mode</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select mode</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* TRANSACTION ID (ONLY FOR UPI) */}
      {paymentMode === "upi" && (
        <div>
          <label className="text-sm text-gray-500">Transaction ID</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter UPI transaction ID"
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={closePaymentPopup}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
        >
          Cancel
        </button>
        <button
        onClick={submitPayment}
        disabled={isSubmitDisabled}
        className={`px-4 py-2 rounded-lg text-white transition ${
          isSubmitDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        Submit
      </button>
      </div>
    </div>
  </div>
)}
{showCollectModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5 space-y-4">
      <h3 className="text-lg font-semibold">
        Confirm Collection
      </h3>

      <p className="text-sm text-gray-600">
        Are you sure you want to mark this amount as collected?
      </p>

      <div className="text-lg font-bold text-red-600">
        ₹{collectContext?.amount}
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => {
            setShowCollectModal(false);
            setCollectContext(null);
          }}
          className="px-4 py-2 rounded-lg bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            updateCollectionStatus({
              delivery_id: collectContext.delivery_id,
              amount: collectContext.amount,
              is_collected: true,
            }).then((res) => {
              if (!res?.status) {
                alert(res?.message || "Failed to update");
                return;
              }

              // ✅ Update UI instantly
              setDpCollectionApiData((prev) =>
                prev.map((x) =>
                  x.delivery_id === collectContext.delivery_id
                    ? { ...x, is_collected: true }
                    : x
                )
              );

              setShowCollectModal(false);
              setCollectContext(null);
            });
          }}
          className="px-4 py-2 rounded-lg bg-green-600 text-white"
        >
          Yes, Mark Collected
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  );
}
