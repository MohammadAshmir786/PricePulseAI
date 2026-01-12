import express from "express";
import { auth, requireRole } from "../middleware/auth.js";
import { createOrder, getOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.use(auth());
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", auth(), requireRole("admin"), (req, res) => {
  // Placeholder for status updates
  res.json({ message: "Status update endpoint" });
});

export default router;
