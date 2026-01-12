import api from "./apiClient.js";

export async function addReview(productId, rating, comment) {
  try {
    const res = await api.post("/reviews", { productId, rating, comment });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to add review";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function getProductReviews(productId) {
  try {
    const res = await api.get(`/reviews/${productId}`);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to fetch reviews";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function updateReview(productId, rating, comment) {
  try {
    const res = await api.post("/reviews", { productId, rating, comment });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to update review";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}
