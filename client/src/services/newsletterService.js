import api from "./apiClient.js";

export async function subscribeToNewsletter(email) {
  try {
    const res = await api.post("/newsletter/subscribe", { email });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to subscribe";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function unsubscribeFromNewsletter(email) {
  try {
    const res = await api.post("/newsletter/unsubscribe", { email });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to unsubscribe";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function getAllSubscribers() {
  try {
    const res = await api.get("/newsletter/subscribers");
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to fetch subscribers";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}
