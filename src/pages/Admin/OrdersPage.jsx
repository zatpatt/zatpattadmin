import React, { useEffect, useState } from "react";
import { getOrdersList, getOrderDetails } from "../../services/ordersApi";

const statusOptions = [
  "placed",
  "accepted",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  // 🔹 FETCH ORDERS LIST
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const list = await getOrdersList();
        setOrders(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔹 UI-ONLY updates (backend later)
  const updateStatus = (order_id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === order_id ? { ...o, status } : o
      )
    );
  };

  const assignDeliveryPartner = (order_id) => {
    const name = prompt("Enter Delivery Partner Name:");
    if (!name) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === order_id
          ? { ...o, delivery_partner: name }
          : o
      )
    );
  };

  // 🔹 VIEW FULL ORDER DETAILS (API CALL)
  const viewReceipt = async (order) => {
    try {
      setDetailsLoading(true);
      const details = await getOrderDetails(order.order_id);
      setSelectedOrder(details);
      setShowReceipt(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold">
        Total Orders ({orders.length})
      </h2>

     <div className="bg-white rounded-2xl shadow overflow-x-auto">
  <table className="min-w-full text-sm border-collapse">
    {/* TABLE HEADER */}
    <thead className="bg-gray-300 text-gray-700 sticky top-0">
      <tr>
        <th className="px-4 py-3 text-center w-16">Sr. No.</th>
        <th className="px-4 py-3 text-left w-36">Order Code</th>
        <th className="px-4 py-3 text-left w-44">Customer</th>
        <th className="px-4 py-3 text-left w-44">Merchant</th>
        <th className="px-4 py-3 text-left w-48">Delivery Partner</th>
        <th className="px-4 py-3 text-center w-28">Amount</th>
        <th className="px-4 py-3 text-center w-40">Status</th>
        <th className="px-4 py-3 text-center w-24">Actions</th>
      </tr>
    </thead>

    {/* TABLE BODY */}
    <tbody className="divide-y">
      {orders.map((o, index) => (
        <tr
          key={o.order_id}
          className="hover:bg-orange-50 transition"
        >
          {/* Sr No */}
          <td className="px-4 py-3 text-center font-medium text-gray-600">
            {index + 1}
          </td>

          {/* Order Code */}
          <td className="px-4 py-3 font-medium text-gray-800">
            {o.order_code}
          </td>

          {/* Customer */}
          <td className="px-4 py-3 text-gray-700">
            {o.customer_name}
          </td>

          {/* Merchant */}
          <td className="px-4 py-3 text-gray-700">
            {o.merchant_name}
          </td>

          {/* Partner */}
          <td className="px-4 py-3 text-gray-600">
            {o.delivery_partner || (
              <span className="text-gray-400 italic">
                Not Assigned
              </span>
            )}
          </td>

          {/* Amount */}
          <td className="px-4 py-3 text-center font-semibold">
            ₹{o.total_amount}
          </td>

          {/* Status */}
          <td className="px-4 py-3 text-center">
            <select
              value={o.status}
              onChange={(e) =>
                updateStatus(o.order_id, e.target.value)
              }
              className="border rounded-md px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </td>

          {/* Actions */}
          <td className="px-4 py-3 text-center">
            <button
              onClick={() => viewReceipt(o)}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs"
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* 🔹 ORDER DETAILS MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-5">
            {detailsLoading || !selectedOrder ? (
              <p>Loading details...</p>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-2">
                  Order {selectedOrder.order_code}
                </h3>

                <p className="text-sm mb-1">
                  <strong>Customer:</strong> {selectedOrder.customer_name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Merchant:</strong> {selectedOrder.merchant_name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Status:</strong> {selectedOrder.status}
                </p>

                <div className="mt-3">
                  <strong className="text-sm">Items:</strong>
                  <ul className="text-sm list-disc pl-5 mt-1">
                    {selectedOrder.items?.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity} — ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm mt-3 space-y-1">
                  <p>Tax: ₹{selectedOrder.tax_amount}</p>
                  <p>Shipping: ₹{selectedOrder.shipping_amount}</p>
                </div>

                <button
                  onClick={() => setShowReceipt(false)}
                  className="mt-4 w-full bg-gray-200 py-2 rounded text-sm"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
