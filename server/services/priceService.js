import { Product } from "../models/Product.js";
import { fetchProductsFromWeb } from "../ai/externalProductFetcher.js";
import { applySmartPrice } from "../utils/priceRule.js";
import { aiService } from "./aiService.js";

export async function recomputePrice(productId) {
  const product = await Product.findById(productId);
  if (!product) return null;

  // Fetch competitor prices from external sources
  const webProducts = await fetchProductsFromWeb(product.name);
  const competitorPrices = webProducts.map(p => p.price);

  // Get AI-based price prediction
  const aiPrediction = await aiService.predictPrice(
    productId,
    product.basePrice,
    {
      category: product.category,
      stock: product.stock,
      demand: product.ratingCount || 0,
      competition: competitorPrices.length
    }
  );

  // Use AI predicted price or fallback to lowest competitor price
  const lowest = Math.min(product.basePrice, ...competitorPrices, aiPrediction.predicted_price);
  const finalPrice = applySmartPrice(lowest) ?? product.basePrice;

  product.finalPrice = finalPrice;
  await product.save();
  return product;
}
