//src\services\dashboardApi.js

import api from "./api";

export const getDashboardValues = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/dashboard-values/",
    payload
  );
  return res.data;
};

export const getDashboardCharts = async (payload) => {
  const res = await api.post(
    "/api/v1/common/orders/dashboard-chart/",
    payload
  );
  return res.data;
};
