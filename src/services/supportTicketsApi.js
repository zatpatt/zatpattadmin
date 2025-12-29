//src\services\supportTicketsApi.js

import api from "./api";

/* ================= LIST ALL / MY TICKETS ================= */
export const listSupportTickets = async () => {
  const response = await api.post(
    "/api/v1/common/orders/my-tickets/",
    {}
  );
  return response.data;
};

/* ================= TICKET DETAILS ================= */
export const getTicketDetails = async (payload) => {
  // payload: { ticket_id }
  const response = await api.post(
    "/api/v1/common/orders/ticket-details/",
    payload
  );
  return response.data;
};

/* ================= UPDATE TICKET STATUS ================= */
export const updateTicketStatus = async (payload) => {
  // payload: { ticket_id, status }
  const response = await api.post(
    "/api/v1/common/orders/update-status/",
    payload
  );
  return response.data;
};

/* ================= ADD MESSAGE (NEW) ================= */
export const addTicketMessage = async (payload) => {
  // payload: { ticket_id, message }
  const response = await api.post(
    "/api/v1/common/orders/add-message/",
    payload
  );
  return response.data;
};
