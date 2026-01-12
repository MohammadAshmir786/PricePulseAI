import api from "./apiClient.js";

export const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const isInWishlist = async (productId) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data.inWishlist;
  } catch (error) {
    return false;
  }
};

export const toggleWishlist = async (productId) => {
  try {
    const response = await api.post(`/wishlist/toggle/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
