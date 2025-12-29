import api from "./api";

/* ================= LIST ALL MENU (ADMIN LEVEL) ================= */
export const listMenuBook = async () => {
  const response = await api.post(
    "/api/v1/common/orders/list-menu-book/",
    {}
  );
  return response.data;
};

/* ================= MENU BY MERCHANT ================= */
export const detailMenuBook = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/detail-menu-book/",
    payload
  );
  return response.data;
};

/* ================= EDIT / UPDATE MENU ITEM ================= */
export const editMenuBook = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/edit-menu-book/",
    payload
  );
  return response.data;
};
