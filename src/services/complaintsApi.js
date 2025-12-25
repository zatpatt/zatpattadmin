import api from "./api";

/**
 * Get Complaints List
 * Backend: POST /api/v1/common/orders/get-complaint/
 */
export const getComplaints = async () => {
  const response = await api.post(
    "/api/v1/common/orders/get-complaint/",
    {}
  );

  // response format: { status: true, data: [...] }
  return response.data?.data || [];
};
