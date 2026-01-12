import axios from "axios";

// Fallback images for when real product images aren't available
const fallbackImages = {
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  wearables: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
  accessories: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop",
  power: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
  peripherals: "https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=500&h=500&fit=crop",
  default: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
};

// Placeholder for external API integrations
// In production, integrate with actual APIs like:
// - Amazon Product Advertising API
// - Flipkart Affiliate API
// - RapidAPI price comparison services

export async function fetchFromAmazon(productName) {
  try {
    // Replace with actual Amazon API integration
    // Example: Using RapidAPI Amazon API
    if (process.env.AMAZON_API_KEY) {
      const response = await axios.get("https://amazon-api.example.com/search", {
        headers: { "X-API-Key": process.env.AMAZON_API_KEY },
        params: { query: productName, limit: 5 },
        timeout: 5000,
      });
      return response.data.products || [];
    }
  } catch (err) {
    console.error("Amazon fetch failed:", err.message);
  }
  return [];
}

export async function fetchFromFlipkart(productName) {
  try {
    // Replace with actual Flipkart API integration
    if (process.env.FLIPKART_API_KEY) {
      const response = await axios.get("https://flipkart-api.example.com/search", {
        headers: { "X-API-Key": process.env.FLIPKART_API_KEY },
        params: { query: productName, limit: 5 },
        timeout: 5000,
      });
      return response.data.products || [];
    }
  } catch (err) {
    console.error("Flipkart fetch failed:", err.message);
  }
  return [];
}

export async function fetchProductsFromWeb(productName) {
  const [amazonProducts, flipkartProducts] = await Promise.all([
    fetchFromAmazon(productName),
    fetchFromFlipkart(productName),
  ]);

  const allProducts = [...amazonProducts, ...flipkartProducts];

  // Deduplicate and sort by price
  const unique = Array.from(
    new Map(allProducts.map((p) => [p.name, p])).values()
  ).sort((a, b) => a.price - b.price);

  return unique;
}

export function findLowestPrice(products) {
  if (!products.length) return null;
  return Math.min(...products.map((p) => p.price || Infinity));
}

export function getImageForCategory(category) {
  const key = category?.toLowerCase().replace(/\s+/g, "") || "default";
  return fallbackImages[key] || fallbackImages.default;
}
