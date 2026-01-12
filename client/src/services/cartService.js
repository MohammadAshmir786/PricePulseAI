import api from "./apiClient.js";

export async function getCart() {
  const res = await api.get("/cart");
  return res.data;
}

export async function addToCart(productId, quantity = 1) {
  const res = await api.post("/cart/add", { productId, quantity });
  return res.data;
}

export async function updateCartItem(productId, quantity) {
  const res = await api.put("/cart/update", { productId, quantity });
  return res.data;
}

export async function removeCartItem(productId) {
  const res = await api.delete(`/cart/item/${productId}`);
  return res.data;
}

export async function clearCart() {
  const res = await api.delete("/cart/clear");
  return res.data;
}
