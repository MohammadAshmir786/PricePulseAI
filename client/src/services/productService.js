import api from "./apiClient.js";

export async function fetchProducts(params = {}) {
  const res = await api.get("/products", { params });
  return res.data;
}

export async function fetchCategories() {
  const res = await api.get("/products/categories");
  return res.data.categories || [];
}

export async function fetchProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload) {
  const res = await api.post("/products", payload);
  return res.data;
}

export async function updateProduct(id, payload) {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

export async function syncProduct(id) {
  const res = await api.patch(`/products/${id}/sync`);
  return res.data;
}

export async function searchProductWeb(name) {
  const res = await api.get(`/products/search/web`, { params: { name } });
  return res.data;
}
