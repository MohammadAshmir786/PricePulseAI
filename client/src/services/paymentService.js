import api from "./apiClient.js";

export async function createPaymentOrder() {
  const res = await api.post("/payments/order");
  return res.data;
}

export async function verifyPayment(paymentData) {
  const res = await api.post("/payments/verify", paymentData);
  return res.data;
}
