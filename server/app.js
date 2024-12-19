import express from "express";
import cors from "cors";
import { config } from "dotenv";
import globalErrorHandler from "./controllers/error.controller.js";
import authRouter from "./routes/auth.route.js";
import cityRouter from "./routes/city.route.js";
import addressRouter from "./routes/address.route.js";
import warehouseRouter from "./routes/warehouse.route.js";
import deliveryStationRouter from "./routes/deliveryStation.route.js";
import userRouter from "./routes/user.route.js";
import vehicleRouter from "./routes/vehicle.route.js";
import productCategoryRouter from "./routes/productCategory.route.js";
import productRouter from "./routes/product.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import mongoose from "mongoose";

// Environment file configuration
// config({ path: "./config.env" });
config();

// Express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route middlewares
app.use("/auth", authRouter);
app.use("/city", cityRouter);
app.use("/address", addressRouter);
app.use("/warehouse", warehouseRouter);
app.use("/deliveryStation", deliveryStationRouter);
app.use("/user", userRouter);
app.use("/vehicle", vehicleRouter);
app.use("/productCategory", productCategoryRouter);
app.use("/product", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

// Unhandled route
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: `No such route found on ${req.originalUrl}.`,
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
