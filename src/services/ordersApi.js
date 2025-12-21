// src/services/ordersApi.js
import api from "./api";

// 🔹 LIST ORDERS (POST-only backend)
export const getOrdersList = async () => {
  const response = await api.post(
    "/api/v1/common/orders/orders-list/",
    {}
  );
  return response.data?.data || [];
};

// 🔹 CREATE ORDER
export const createOrder = async (orderData) => {
  const response = await api.post(
    "/api/v1/common/orders/orders-list/",
    orderData
  );
  return response.data;
};

// 🔹 UPDATE ORDER (status / partner)
export const updateOrder = async (orderId, payload) => {
  const response = await api.patch(
    `/api/v1/common/orders/orders-list/${orderId}/`,
    payload
  );
  return response.data;
};

// 🔹 GET SINGLE ORDER DETAILS (NEW ✅)
export const getOrderDetails = async (orderId) => {
  const response = await api.post(
    "/api/v1/common/orders/get-order/",
    { order_id: orderId }
  );

  return response.data?.data || null;
};
