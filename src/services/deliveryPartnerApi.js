// src/services/deliveryPartnerApi.js
import api from "./api";

/* ---------------- ADD DELIVERY PARTNER ---------------- */
export const addDeliveryPartner = async (formData) => {
  const response = await api.post(
    "/api/v1/common/orders/add-delivery-partner/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/* ---------------- LIST DELIVERY PARTNERS ---------------- */
export const getDeliveryPartners = async () => {
  const response = await api.post(
    "/api/v1/common/orders/delivery-partner-list/",
    {}
  );
  return response.data;
};

/* ---------------- DELIVERY PARTNER DETAILS ---------------- */
export const getDeliveryPartnerDetails = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/delivery-partner-details/",
    payload
  );
  return response.data;
};

/* ---------------- UPDATE DELIVERY PARTNER ---------------- */
export const updateDeliveryPartner = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-delivery-partner/",
    payload
  );
  return response.data;
};
