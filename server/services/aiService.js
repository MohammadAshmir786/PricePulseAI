import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5000";

export const aiService = {
  /**
   * Get personalized product recommendations for a user
   */
  async getRecommendations(userId, productIds, userHistory, limit = 10) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/recommendations`,
        {
          userId,
          productIds,
          userHistory,
          limit,
        },
        { timeout: 5000 }
      );
      return response.data.recommendations;
    } catch (error) {
      console.error("AI recommendations failed:", error.message);
      // Fallback: return random products
      return productIds.slice(0, limit);
    }
  },

  /**
   * Get similar products based on product features
   */
  async getSimilarProducts(productId, productFeatures, allProducts, limit = 5) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/similar-products`,
        {
          productId,
          productFeatures,
          allProducts,
          limit,
        },
        { timeout: 5000 }
      );
      return response.data.similar_products;
    } catch (error) {
      console.error("AI similar products failed:", error.message);
      // Fallback: return products from same category
      return allProducts
        .filter(
          (p) =>
            p._id !== productId &&
            p.category === productFeatures.category
        )
        .slice(0, limit)
        .map((p) => p._id);
    }
  },

  /**
   * Predict optimal price for a product
   */
  async predictPrice(productId, basePrice, features, historicalData = []) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/predict-price`,
        {
          productId,
          basePrice,
          features,
          historicalData,
        },
        { timeout: 5000 }
      );
      return response.data.prediction;
    } catch (error) {
      console.error("AI price prediction failed:", error.message);
      // Fallback: apply simple discount
      return {
        product_id: productId,
        base_price: basePrice,
        predicted_price: basePrice * 0.95,
        discount_percentage: 5,
        confidence: 0.5,
        strategy: "fallback",
      };
    }
  },

  /**
   * Analyze sentiment of product reviews
   */
  async analyzeSentiment(reviews) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/analyze-sentiment`,
        {
          reviews,
        },
        { timeout: 5000 }
      );
      return response.data.sentiment;
    } catch (error) {
      console.error("AI sentiment analysis failed:", error.message);
      // Fallback: simple rating-based analysis
      const avgRating =
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        reviews.length || 0;
      return {
        overall_sentiment: avgRating >= 4 ? "positive" : avgRating <= 2 ? "negative" : "neutral",
        sentiment_score: (avgRating - 3) / 2,
        average_rating: avgRating,
        total_reviews: reviews.length,
        insights: [],
      };
    }
  },

  /**
   * Train recommendation model with new interaction data
   */
  async trainRecommendations(interactions) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/train-recommendations`,
        {
          interactions,
        },
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      console.error("AI model training failed:", error.message);
      throw error;
    }
  },

  /**
   * Check if AI service is healthy
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/health`, {
        timeout: 3000,
      });
      return response.data.status === "healthy";
    } catch (error) {
      console.error("AI service health check failed:", error.message);
      return false;
    }
  },
};
