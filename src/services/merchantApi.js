// src/services/merchantApi.js
import api from "./api";

/**
 * 🔹 GET MERCHANT LIST
 * POST: /get-merchants/
 */
export const getMerchants = async () => {
  const response = await api.post(
    "/api/v1/common/orders/get-merchants/",
    {}
  );

  return response.data?.data || [];
};

/**
 * 🔹 ADD NEW MERCHANT
 * POST: /add-merchant/
 */
export const addMerchant = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/add-merchant/",
    payload
  );

  return response.data;
};

/**
 * 🔹 UPDATE MERCHANT DETAILS
 * POST: /update-merchant-details/
 */
export const updateMerchant = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-merchant-details/",
    payload
  );

  return response.data;
};
