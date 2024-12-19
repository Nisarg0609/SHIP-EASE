import express from "express";
import {
  checkProductAvailability,
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateVariant,
} from "../controllers/product.controller.js";
import {
  categoryExists,
  isLeafCategory,
} from "../controllers/productCategory.controller.js";

const router = express.Router();
router.route("/").get(getProducts).post(categoryExists, isLeafCategory, createProduct);
router.route("/checkProductAvailability").patch(checkProductAvailability);
router.route("/:id").get(getProduct).patch(updateProduct);
router.route("/:id/variant").patch(updateVariant);

export default router;
