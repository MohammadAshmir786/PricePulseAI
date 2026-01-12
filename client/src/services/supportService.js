import api from "./apiClient.js";

export async function sendSupportMessage(message, history = []) {
  const res = await api.post("/support/chat", { message, history });
  return res.data;
}
