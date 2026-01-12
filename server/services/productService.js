import { Product } from "../models/Product.js";
import { fetchProductsFromWeb, findLowestPrice } from "../ai/externalProductFetcher.js";
import { applySmartPrice } from "../utils/priceRule.js";

export async function searchAndCreateProduct(productName) {
  // Check if product already exists
  const existing = await Product.findOne({ name: productName });
  if (existing) return existing;

  try {
    // Fetch from Amazon, Flipkart, etc.
    const webProducts = await fetchProductsFromWeb(productName);
    if (!webProducts || webProducts.length === 0) {
      throw new Error("No products found on web");
    }

    // Get the best (lowest price) product
    const bestProduct = webProducts[0];
    const lowestPrice = bestProduct.price;
    const finalPrice = applySmartPrice(lowestPrice);

    // Create product in our DB
    const product = await Product.create({
      name: bestProduct.name || productName,
      description: bestProduct.description || "Fetched from e-commerce platforms",
      category: bestProduct.category || "General",
      images: bestProduct.images || ["https://via.placeholder.com/400x300?text=Product"],
      basePrice: lowestPrice,
      finalPrice: finalPrice,
      stock: bestProduct.stock || 10,
      metadata: {
        source: bestProduct.source || "multiple",
        originalPrice: lowestPrice,
        competitors: webProducts.slice(1, 5),
      },
    });

    return product;
  } catch (err) {
    console.error("Product search failed:", err.message);
    return null;
  }
}

export async function syncProductPrices(productId) {
  // Refresh prices for an existing product by searching web again
  const product = await Product.findById(productId);
  if (!product) return null;

  try {
    const webProducts = await fetchProductsFromWeb(product.name);
    if (webProducts && webProducts.length > 0) {
      const lowestPrice = webProducts[0].price;
      const finalPrice = applySmartPrice(lowestPrice);

      product.basePrice = lowestPrice;
      product.finalPrice = finalPrice;
      product.metadata = {
        ...product.metadata,
        lastSync: new Date(),
        competitors: webProducts.slice(1, 5),
      };

      await product.save();
    }
  } catch (err) {
    console.error("Price sync failed:", err.message);
  }

  return product;
}
