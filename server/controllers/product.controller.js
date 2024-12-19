import City from "../models/city.model.js";
import Product from "../models/product.model.js";
import ProductCategory from "../models/productCategory.model.js";
import Warehouse from "../models/warehouse.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { filterObject } from "../utils/helper.js";
import {
  createOne,
  getById,
  getByIdAndUpdate,
  getMany,
  sendResponse,
  updateOne,
} from "./factoryHandler.js";

const createProduct = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "name",
    "description",
    "additionalInformation",
    "category",
    "brand",
    "maxPurchaseQuantity",
    "tags",
    "variants",
    "weight",
    "dimensions",
    "isFeatured",
  ];
  const filteredBody = filterObject(req.body, allowedFields);

  const product = await Product.create(filteredBody);

  // add default stock of variant in warehouse
  const warehouses = await Warehouse.find({ isActive: true });

  await Promise.all(
    warehouses.map(async (warehouse) => {
      const productEntry = {
        product: product._id,
        variants: product.variants.map((variant) => ({
          sku: variant.sku,
          stock: 10,
        })),
      };

      warehouse.products.push(productEntry);
      await warehouse.save();
    })
  );

  sendResponse(res, product);
});

const getProducts = getMany(Product, {
  path: "category",
  select: "name",
});

const getProduct = getById(Product, {
  path: "category",
  select: "name",
});

const updateProduct = updateOne(Product, [
  "name",
  "description",
  "additionalInformation",
  "category",
  "brand",
  "maxPurchaseQuantity",
  "tags",
  "weight",
  "dimensions",
  "isFeatured",
  "isActive",
]);

const updateVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new AppError(`No product found with id ${req.params.id}`, 404));

  const { variantId, attributes, price, discount, isActive } = req.body;

  const variant = product.variants.find((v) => v._id.toString() === variantId);
  if (!variant) return next(new AppError(`No variant found with id ${variantId}`, 404));
  if (attributes) variant.attributes = attributes;
  if (price) variant.price = price;
  if (discount) variant.discount = discount;
  if (isActive) variant.isActive = isActive;

  const updatedProduct = await product.save();
  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

const checkProductAvailability = catchAsync(async (req, res, next) => {
  const { productId, variantSku, pincode } = req.body;
  if (!productId || !variantSku || !pincode)
    return next(new AppError("Please provide productId, variantSku and pincode", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  const variant = product.variants.find((variant) => variant.sku === variantSku);
  if (!variant) return next(new AppError("Variant not found", 404));

  const result = /^[0-9]{6}$/.test(pincode);
  if (!result) return next(new AppError("Please provide valid pincode", 400));

  const city = await City.findOne({ pincodes: pincode });
  if (!city) return next(new AppError("Not Deliverable", 404));

  const warehouse = await Warehouse.findOne({ transportCities: city._id });
  if (!warehouse) return next(new AppError("Not Deliverable", 404));

  const warehouseProduct = warehouse.products.find((p) => p.product.equals(productId));
  if (!warehouseProduct) return next(new AppError("Not Available", 404));

  const warehouseVariant = warehouseProduct.variants.find((v) => v.sku === variantSku);
  if (!warehouseVariant) return next(new AppError("Not Available", 404));

  const variantStock = warehouseVariant.stock;
  if (variantStock === 0) return next(new AppError("Out of Stock", 404));

  sendResponse(res, result);
});

export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateVariant,
  checkProductAvailability,
};
