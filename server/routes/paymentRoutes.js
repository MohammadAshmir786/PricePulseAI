import express from "express";
import { auth } from "../middleware/auth.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.use(auth());
router.post("/order", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
