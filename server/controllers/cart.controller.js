import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendResponse } from "./factoryHandler.js";

const validateCartRequest = catchAsync(async (req, res, next) => {
  const { productId, variantSku, variantStock } = req.body;

  const urlParts = req.originalUrl.split("/");
  const action = urlParts[urlParts.length - 1];
  if (action === "update") {
    if (!variantStock || variantStock < 0)
      return next(
        new AppError("Please provide variant stock which should be positive.", 400)
      );
  }
  if (!productId || !variantSku)
    return next(new AppError("Please provide product id and variant sku", 400));

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

const addItemToCart = catchAsync(async (req, res, next) => {
  const { productId, variantSku } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    const cart = await Cart.create({ user: req.user._id, items: [] });
    cart.items.push({
      product: productId,
      variants: [{ variantSku, variantStock: 1 }],
    });
    await cart.save();
    sendResponse(res, cart);
  } else {
    const productIndex = cart.items.findIndex((item) => item.product.equals(productId));
    if (productIndex === -1) {
      cart.items.push({
        product: productId,
        variants: [{ variantSku, variantStock: 1 }],
      });
      await cart.save();
    } else {
      const variantIndex = cart.items[productIndex].variants.findIndex(
        (variant) => variant.variantSku === variantSku
      );
      if (variantIndex === -1) {
        cart.items[productIndex].variants.push({
          variantSku,
          variantStock: 1,
        });
        await cart.save();
      } else {
        return next(new AppError("Product Variant already exists in cart", 400));
      }
    }
    sendResponse(res, cart);
  }
});

const removeItemFromCart = catchAsync(async (req, res, next) => {
  const { productId, variantSku } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 400));

  const productIndex = cart.items.findIndex((item) => item.product.equals(productId));
  if (productIndex === -1)
    return next(new AppError("Product is not present in cart.", 400));

  const variantIndex = cart.items[productIndex].variants.findIndex(
    (variant) => variant.variantSku === variantSku
  );
  if (variantIndex === -1)
    return next(new AppError("Product Variant is not present in cart.", 400));

  if (cart.items[productIndex].variants.length === 1) {
    // remove product from cart
    cart.items.splice(productIndex, 1);
  } else {
    // remove variant from product
    cart.items[productIndex].variants.splice(variantIndex, 1);
  }
  await cart.save();

  sendResponse(res, cart);
});

const updateCart = catchAsync(async (req, res, next) => {
  const { productId, variantSku, variantStock } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart does not exist.", 400));

  const productIndex = cart.items.findIndex((item) => item.product.equals(productId));
  if (productIndex === -1)
    return next(new AppError("Product is not present in cart.", 400));

  const variantIndex = cart.items[productIndex].variants.findIndex(
    (variant) => variant.variantSku === variantSku
  );
  if (variantIndex === -1)
    return next(new AppError("Product Variant is not present in cart.", 400));

  const product = await Product.findById(productId);
  if (product.maxPurchaseQuantity < variantStock)
    return next(
      new AppError(
        `You can add upto ${product.maxPurchaseQuantity} quantity of this product.`,
        400
      )
    );

  if (variantStock === 0) {
    // remove product from cart
    cart.items.splice(productIndex, 1);
  } else {
    cart.items[productIndex].variants[variantIndex].variantStock = variantStock;
  }
  await cart.save();
  sendResponse(res, cart);
});

const getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return next(new AppError("Cart is Empty.", 404));

  cart.items.map((item) => {
    const product = item.product;
    product.variants = product.variants.filter((variant) =>
      item.variants.some((wishlistVariant) => wishlistVariant.variantSku === variant.sku)
    );
  });

  sendResponse(res, cart);
});

export { validateCartRequest, addItemToCart, removeItemFromCart, updateCart, getCart };
