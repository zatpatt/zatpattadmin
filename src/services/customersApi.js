// src/services/customersApi.js
import api from "./api";

// 🔹 CUSTOMER LIST
export const getCustomerList = async () => {
  const response = await api.post(
    "/api/v1/common/orders/customer-list/",
    {}
  );
  return response.data?.data || [];
};

// 🔹 CUSTOMER DETAILS
export const getCustomerDetails = async (customerId) => {
  const response = await api.post(
    "/api/v1/common/orders/get-customer-detail/",
    { customer_id: customerId }
  );
  return response.data?.data || null;
};

// 🔹 ACTIVATE / DEACTIVATE CUSTOMER
export const updateCustomerStatus = async (
  customerId,
  isActive
) => {
  const response = await api.post(
    "/api/v1/common/orders/customer-inactive/",
    {
      customer_id: customerId,
      activity_status: isActive,
    }
  );
  return response.data;
};
