import api from "./api";

/**
 * 🔹 GET MERCHANT LIST
 */
export const getMerchants = async () => {
  const response = await api.post(
    "/api/v1/common/orders/get-merchants/",
    {}
  );
  return response.data?.data || [];
};

/**
 * 🔹 GET SINGLE MERCHANT DETAIL (NEW)
 * POST: /get-merchant-detail/
 */
export const getMerchantDetail = async (merchantId) => {
  const response = await api.post(
    "/api/v1/common/orders/get-merchant-detail/",
    {
      merchant_id: merchantId,
    }
  );

  return response.data?.data || null;
};

/**
 * 🔹 ADD NEW MERCHANT
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
 */
export const updateMerchant = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-merchant-details/",
    payload
  );
  return response.data;
};
