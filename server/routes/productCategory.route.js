import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithSubcategories,
  getCategory,
  getProductsUnderCategory,
  updateCategory,
  upload,
} from "../controllers/productCategory.controller.js";
import multer from "multer";

// Middleware for optional file upload
const optionalUpload = (req, res, next) => {
  const uploadMiddleware = upload.single("image");
  uploadMiddleware(req, res, (err) => {
    if (err) return next(err); // Handle upload errors
    next(); // Proceed if no errors
  });
};

const router = express.Router();
router.route("/").get(getCategories).post(upload.single("categoryImage"), createCategory);
router.route("/subCategories").get(getCategoriesWithSubcategories);
router
  .route("/:id")
  .get(getCategory)
  .patch(optionalUpload, updateCategory)
  .delete(deleteCategory);
router.route("/:id/products").get(getProductsUnderCategory);

export default router;
