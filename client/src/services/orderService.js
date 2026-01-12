import api from "./apiClient.js";

export async function createOrder(orderData) {
  const res = await api.post("/orders", orderData);
  return res.data;
}

export async function fetchOrders() {
  const res = await api.get("/orders");
  return res.data;
}
