//src\services\promotionsApi.js
import api from "./api";

/**
 * ADD NEW OFFER / PROMOTION
 * POST /api/v1/common/orders/add-offers/
 */
export const addOffer = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/add-offers/",
    payload
  );
  return response.data;
};

/**
 * GET ALL OFFERS
 * POST /api/v1/common/orders/get-offers/
 */
export const getOffers = async () => {
  const response = await api.post(
    "/api/v1/common/orders/get-offers/",
    {}
  );
  return response.data?.data || [];
};

/**
 * EDIT OFFER
 * POST /api/v1/common/orders/edit-offer/
 */
export const editOffer = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/edit-offer/",
    payload
  );
  return response.data;
};
