// src/services/financialApi.js

import api from "./api";

/**
 * Get Delivery Partner Payout Summary
 * @param {Object} payload
 * @param {string} payload.start_date - YYYY-MM-DD
 * @param {string} payload.end_date - YYYY-MM-DD
 */

/* ---------------- COLLECTION ---------------- */
export const getCollectionFromDeliveryPartner = async () => {
  const response = await api.post(
    "/api/v1/common/orders/collection-from-delivery-part/",
    {}
  );
  return response.data;
};

/* ---------------- UPDATE COLLECTION ---------------- */
export const updateCollectionStatus = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-collection/",
    payload
  );
  return response.data;
};

/**
 * Get Delivery Partner Payout Requests
 */
export const getDeliveryPartnerPayout = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/delivery-partner-payout/",
    payload
  );
  return response.data;
};


/* ---------------- DP REQUEST GET ---------------- */
export const getDeliveryPartnerPaymentRequests = async () => {
  const response = await api.post(
    "/api/v1/common/orders/delivery-partner-payment-request/",
    {}
  );
  return response.data;
};

/* ---------------- DP REQUEST UPDATE ---------------- */
export const updatePartnerPaymentRequest = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-partner-payment-request/",
    payload
  );
  return response.data;
};

/* ---------------- DP PAYMENT PROCESS ---------------- */
export const updatePartnerPaymentProcess = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-partner-payment-process/",
    payload
  );
  return response.data;
};

/* ---------------- MERCHANT ---------------- */

export const getMerchantPayout = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/merchant-payout/",
    payload
  );
  return response.data;
};

export const getMerchantPaymentRequests = async () => {
  const response = await api.post(
    "/api/v1/common/orders/merchant-payment-request/",
    {}
  );
  return response.data;
};

export const updateMerchantPaymentRequest = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-merchant-payment-request/",
    payload
  );
  return response.data;
};

export const updateMerchantPaymentProcess = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-merchant-payment-process/",
    payload
  );
  return response.data;
};
