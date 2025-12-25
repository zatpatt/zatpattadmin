import api from "./api";

/* ---------------- TOTAL EARNING (DATE WISE) ---------------- */
export const getTotalEarning = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/total-earning/",
    payload
  );
  return res.data;
};

/* ---------------- MERCHANT WISE EARNING ---------------- */
export const getMerchantEarning = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/total-merchant-earning/",
    payload
  );
  return res.data;
};

/* ---------------- TOP SELLING ITEMS ---------------- */
export const getTopItems = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/top-items/",
    payload
  );
  return res.data;
};
