import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  checkInWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(auth());

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.post("/toggle/:productId", toggleWishlist);
router.get("/check/:productId", checkInWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;
