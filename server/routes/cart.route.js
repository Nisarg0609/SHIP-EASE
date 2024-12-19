import express from "express";
import {
  addItemToCart,
  getCart,
  removeItemFromCart,
  updateCart,
  validateCartRequest,
} from "../controllers/cart.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").get(protect, getCart);
router.route("/add").patch(protect, validateCartRequest, addItemToCart);
router.route("/remove").patch(protect, validateCartRequest, removeItemFromCart);
router.route("/update").patch(protect, validateCartRequest, updateCart);

export default router;
