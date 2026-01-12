import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    metadata: { type: Object },
  },
  { timestamps: true }
);

// Text index to support search queries (name/description/tags)
productSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = mongoose.model("Product", productSchema);
