import express from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  listProducts,
  listCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  syncPrices,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/categories", listCategories);
router.get("/search/web", searchProduct);
router.get("/:id", getProduct);
router.post("/", auth(), requireRole("admin"), createProduct);
router.put("/:id", auth(), requireRole("admin"), updateProduct);
router.delete("/:id", auth(), requireRole("admin"), deleteProduct);
router.patch("/:id/sync", auth(), requireRole("admin"), syncPrices);
router.put("/:id", auth(), requireRole("admin"), updateProduct);
router.delete("/:id", auth(), requireRole("admin"), deleteProduct);

export default router;
