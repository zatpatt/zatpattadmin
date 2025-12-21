import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Ban,
  CheckCircle,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import {
  getCustomerDetails,
  updateCustomerStatus,
} from "../../../services/customersApi";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getCustomerDetails(id);
        setCustomer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const toggleStatus = async () => {
    try {
      setUpdating(true);
      await updateCustomerStatus(id, !customer.is_active);
      setCustomer({
        ...customer,
        is_active: !customer.is_active,
      });
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading customer...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">
          Customer Details
        </h2>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <div className="text-lg font-semibold">
          {customer.full_name}
        </div>
        <div className="text-gray-600">{customer.phone}</div>

        <div className="text-sm">
          Status:{" "}
          <strong
            className={
              customer.is_active
                ? "text-green-600"
                : "text-red-500"
            }
          >
            {customer.is_active ? "Active" : "Inactive"}
          </strong>
        </div>

        <button
          onClick={toggleStatus}
          disabled={updating}
          className={`w-full mt-3 py-2 rounded-xl text-white ${
            customer.is_active
              ? "bg-red-500"
              : "bg-green-600"
          }`}
        >
          {customer.is_active
            ? "Block Customer"
            : "Unblock Customer"}
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="text-orange-500" />
          <div className="font-semibold">Order History</div>
        </div>

        {customer.order_history?.length ? (
          customer.order_history.map((o, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b"
            >
              <div>
                <div className="font-medium">
                  Order #{o.order_code}
                </div>
                <div className="text-sm text-gray-500">
                  {o.merchant}
                </div>
              </div>
              <div className="text-right">
                <div>₹{o.amount}</div>
                <div className="text-sm text-gray-500">
                  {o.delivery_partner}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No orders found.</p>
        )}
      </div>

      {/* Refund History */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-green-500" />
          <div className="font-semibold">Refund History</div>
        </div>

        {customer.refund_history?.length ? (
          customer.refund_history.map((r, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b"
            >
              <div>Order #{r.order_code}</div>
              <div className="text-green-600">
                ₹{r.refund_amount} ({r.status})
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No refunds yet.</p>
        )}
      </div>

      {/* Remarks */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-2">
          <Ban className="text-red-500" />
          <div className="font-semibold">Remarks</div>
        </div>

        {customer.remark?.length ? (
          customer.remark.map((r, i) => (
            <div key={i} className="py-2 border-b">
              <strong>Order #{r.order_code}:</strong>{" "}
              {r.remark}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No remarks.</p>
        )}
      </div>
    </div>
  );
}
