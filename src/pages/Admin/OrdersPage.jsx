// src/pages/Admin/OrdersPage.jsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Sample orders data
const initialOrders = [
  {
    id: "ORD001",
    customer: "Rahul",
    merchant: "Shree Sweets",
    deliveryPartner: "Not Assigned",
    items: [
      { name: "Gulab Jamun", qty: 2, price: 50 },
      { name: "Ladoo", qty: 1, price: 120 },
    ],
    tax: 15,
    shipping: 20,
    amount: 220,
    status: "Placed",
  },
  {
    id: "ORD002",
    customer: "Priya",
    merchant: "Vada Pav House",
    deliveryPartner: "Ramesh",
    items: [
      { name: "Vada Pav", qty: 4, price: 20 },
    ],
    tax: 5,
    shipping: 10,
    amount: 80,
    status: "On the Way",
  },
  {
    id: "ORD003",
    customer: "Amit",
    merchant: "Cafe 24",
    deliveryPartner: "Not Assigned",
    items: [
      { name: "Coffee", qty: 2, price: 50 },
      { name: "Sandwich", qty: 1, price: 50 },
    ],
    tax: 10,
    shipping: 10,
    amount: 150,
    status: "Delivered",
  },
];

const statusOptions = ["Placed", "Accepted", "Preparing", "On the Way", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Update order status
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // Assign delivery partner
  const assignDeliveryPartner = (id) => {
    const name = prompt("Enter Delivery Partner Name:");
    if (name) {
      setOrders(orders.map(o => o.id === id ? { ...o, deliveryPartner: name } : o));
    }
  };

  // Auto-assign delivery partner (mock)
  const autoAssignPartner = (id) => {
    const randomPartners = ["Ramesh", "Suresh", "Anil", "Priya", "Neha"];
    const partner = randomPartners[Math.floor(Math.random() * randomPartners.length)];
    setOrders(orders.map(o => o.id === id ? { ...o, deliveryPartner: partner } : o));
  };

  // Cancel order
  const cancelOrder = (id) => {
    const reason = prompt("Enter cancellation reason:");
    if (reason) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: "Cancelled", cancelReason: reason } : o));
    }
  };

  // Trigger refund (mock)
  const triggerRefund = (id) => {
    alert(`Refund initiated for order ${id}`);
  };

  // Reassign merchant
  const reassignMerchant = (id) => {
    const merchant = prompt("Enter new merchant name:");
    if (merchant) {
      setOrders(orders.map(o => o.id === id ? { ...o, merchant } : o));
    }
  };

  // View order receipt
  const viewReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  // Reorder (mock)
  const reorder = (order) => {
    const newOrder = { ...order, id: uuidv4(), status: "Placed", deliveryPartner: "Not Assigned" };
    setOrders([newOrder, ...orders]);
    alert(`Order ${order.id} reordered as ${newOrder.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders Management</h2>
        <div className="text-sm text-gray-500">{orders.length} orders</div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3">Merchant</th>
              <th className="p-3">Delivery Partner</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3 text-center">{o.merchant}</td>
                <td className="p-3 text-center">
                  {o.deliveryPartner}
                  <div className="flex gap-1 justify-center mt-1">
                    <button onClick={() => assignDeliveryPartner(o.id)} className="px-1 py-0.5 text-xs bg-yellow-200 rounded">Edit</button>
                    <button onClick={() => autoAssignPartner(o.id)} className="px-1 py-0.5 text-xs bg-green-200 rounded">Auto</button>
                  </div>
                </td>
                <td className="p-3 text-center">₹{o.amount}</td>
                <td className="p-3 text-center">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border px-1 py-0.5 rounded text-xs"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-center space-y-1">
                  <button onClick={() => viewReceipt(o)} className="px-2 py-1 bg-orange-500 text-white rounded text-xs w-full">View</button>
                  <button onClick={() => cancelOrder(o.id)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs w-full">Cancel</button>
                  <button onClick={() => triggerRefund(o.id)} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs w-full">Refund</button>
                  <button onClick={() => reassignMerchant(o.id)} className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs w-full">Reassign</button>
                  <button onClick={() => reorder(o)} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs w-full">Reorder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Order Receipt ({selectedOrder.id})</h3>
              <button onClick={() => setShowReceipt(false)} className="text-gray-500">Close</button>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Customer:</strong> {selectedOrder.customer}</div>
              <div><strong>Merchant:</strong> {selectedOrder.merchant}</div>
              <div><strong>Delivery Partner:</strong> {selectedOrder.deliveryPartner}</div>
              <div><strong>Status:</strong> {selectedOrder.status}</div>
              <div className="mt-2"><strong>Items:</strong></div>
              <ul className="pl-4 list-disc">
                {selectedOrder.items.map((i, idx) => (
                  <li key={idx}>{i.name} x{i.qty} - ₹{i.price * i.qty}</li>
                ))}
              </ul>
              <div><strong>Tax:</strong> ₹{selectedOrder.tax}</div>
              <div><strong>Shipping:</strong> ₹{selectedOrder.shipping}</div>
              <div className="mt-1 font-bold"><strong>Total:</strong> ₹{selectedOrder.amount}</div>
              {selectedOrder.cancelReason && <div className="text-red-600"><strong>Cancel Reason:</strong> {selectedOrder.cancelReason}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
