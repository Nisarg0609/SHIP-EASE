import express from "express";
import {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
  validateWishlistRequest,
} from "../controllers/wishlist.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").get(protect, getWishlist);
router.route("/add").patch(protect, validateWishlistRequest, addItemToWishlist);
router.route("/remove").patch(protect, validateWishlistRequest, removeItemFromWishlist);

export default router;
