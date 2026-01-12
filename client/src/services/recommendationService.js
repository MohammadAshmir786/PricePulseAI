import api from "./apiClient.js";

/**
 * Fetch AI-powered recommendations
 * @param {number} limit - Number of recommendations to return (default: 9)
 * @returns {Promise<Array>} Array of recommended products
 */
export async function fetchRecommendations(limit = 9) {
  try {
    const response = await api.get("/recommendations", {
      params: { limit },
    });
    return response.data?.recommendations || [];
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}

/**
 * Fetch similar products for a given product
 * @param {string} productId - The product ID to find similar products for
 * @param {number} limit - Number of similar products to return (default: 5)
 * @returns {Promise<Array>} Array of similar products
 */
export async function fetchSimilarProducts(productId, limit = 5) {
  try {
    const response = await api.get(
      `/recommendations/${productId}/similar`,
      {
        params: { limit },
      }
    );
    return response.data?.similar_products || [];
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    return [];
  }
}
