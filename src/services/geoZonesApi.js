import api from "./api";

/* ================= CREATE GEO ZONE ================= */
export const createGeoZone = async (payload) => {
  const response = await api.post(
    "/api/v1/common/orders/create-geo-zone/",
    payload
  );
  return response.data;
};

/* ================= LIST GEO ZONES ================= */
export const listGeoZones = async () => {
  const response = await api.post(
    "/api/v1/common/orders/list-geo-zones/",
    {}
  );
  return response.data;
};
