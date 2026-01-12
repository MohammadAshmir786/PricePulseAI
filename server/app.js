import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import passport from "./config/passport.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: Date.now() }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/support", supportRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI);
app.listen(port, () => console.log(`API running on port ${port}`));
