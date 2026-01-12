import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    pricing: {
      subtotal: { type: Number },
      shipping: { type: Number },
      tax: { type: Number },
    },
    paymentInfo: {
      provider: { type: String },
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
      method: { type: String },
    },
    address: { type: Object },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
