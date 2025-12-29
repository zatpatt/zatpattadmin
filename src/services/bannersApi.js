import api from "./api";

/* ================= ADD BANNER ================= */
export const addBanner = async (formData) => {
  const response = await api.post(
    "/api/v1/common/orders/add-banner/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/* ================= LIST BANNERS ================= */
export const listBanners = async () => {
  const response = await api.post(
    "/api/v1/common/orders/banner-list/",
    {}
  );
  return response.data;
};

/* ================= UPDATE BANNER ================= */
export const updateBanner = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/update-banner/",
    payload
  );
  return response.data;
};
