import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import { sendResponse } from "./factoryHandler.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const validateWishlistRequest = catchAsync(async (req, res, next) => {
  const { productId, variantSku } = req.body;
  if (!productId || !variantSku)
    return next(new AppError("Please provide product id and variantSku", 400));

  const productExists = await Product.findById(productId);
  if (!productExists)
    return next(new AppError(`No product found with id ${productId}`, 404));

  const variantExists = await Product.findOne({
    _id: productId,
    "variants.sku": variantSku,
  });
  if (!variantExists)
    return next(new AppError(`No variant found with variant sku : ${variantSku}`, 404));

  next();
});

const addItemToWishlist = catchAsync(async (req, res, next) => {
  const { productId, variantSku } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    // create wishlist
    const wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    // and add item to wishlist
    wishlist.items.push({ product: productId, variants: [{ variantSku }] });
    await wishlist.save();
  } else {
    // check if product exists
    const productIndex = wishlist.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex === -1) {
      wishlist.items.push({ product: productId, variants: [{ variantSku }] });
      await wishlist.save();
    } else {
      const variantIndex = wishlist.items[productIndex].variants.findIndex(
        (variant) => variant.variantSku === variantSku
      );
      if (variantIndex !== -1)
        return next(new AppError("This variant is already in the wishlist", 400));
      wishlist.items[productIndex].variants.push({ variantSku });
      await wishlist.save();
    }
  }

  sendResponse(res, wishlist);
});

const removeItemFromWishlist = catchAsync(async (req, res, next) => {
  const { productId, variantSku } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return next(new AppError(`No wishlist found`, 404));
  }

  const productIndex = wishlist.items.findIndex((item) => item.product.equals(productId));
  if (productIndex === -1) {
    return next(new AppError("Product is not in your wishlist", 400));
  }

  const variantIndex = wishlist.items[productIndex].variants.findIndex(
    (variant) => variant.variantSku === variantSku
  );
  if (variantIndex === -1)
    return next(new AppError("Prouct Variant is not in your wishlist", 400));

  wishlist.items[productIndex].variants = wishlist.items[productIndex].variants.filter(
    (variant) => variant.variantSku !== variantSku
  );
  await wishlist.save();

  sendResponse(res, wishlist);
});

const getWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user }).populate("items.product");
  if (!wishlist || wishlist.items.length === 0)
    return next(new AppError("No items found in wishlist", 404));

  wishlist.items.map((item) => {
    const product = item.product;
    product.variants = product.variants.filter((variant) =>
      item.variants.some((wishlistVariant) => wishlistVariant.variantSku === variant.sku)
    );
  });

  sendResponse(res, wishlist.items);
});

export {
  addItemToWishlist,
  removeItemFromWishlist,
  getWishlist,
  validateWishlistRequest,
};
