import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(auth());
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/item/:productId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
