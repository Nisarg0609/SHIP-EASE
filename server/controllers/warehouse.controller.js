import Address from "../models/address.model.js";
import City from "../models/city.model.js";
import Product from "../models/product.model.js";
import Warehouse from "../models/warehouse.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createOne,
  getById,
  getByIdAndDelete,
  getByIdAndUpdate,
  getMany,
  sendResponse,
} from "./factoryHandler.js";

const getWarehouses = getMany(
  Warehouse,
  [
    {
      path: "address",
      select: "street city postalCode",
      populate: { path: "city", select: "city state" },
    },
    {
      path: "transportCities",
      select: "city",
    },
    {
      path: "manager",
      select: "name",
      match: { role: "warehouseManager" },
    },
  ],
  {},
  { location: 0, products: 0 }
);

// const getWarehouses = catchAsync(async (req, res, next) => {
//   const warehouses = await Warehouse.aggregate([
//     {
//       $lookup: {
//         from: "addresses",
//         localField: "address",
//         foreignField: "_id",
//         as: "address",
//         pipeline: [
//           {
//             $project: {
//               __v: 0,
//               createdAt: 0,
//               updatedAt: 0,
//             },
//           },
//           {
//             $lookup: {
//               from: "cities",
//               localField: "city",
//               foreignField: "_id",
//               as: "city",
//               pipeline: [
//                 {
//                   $project: {
//                     city: 1,
//                     _id: 0,
//                   },
//                 },
//               ],
//             },
//           },
//           {
//             $unwind: "$city",
//           },
//           {
//             $addFields: {
//               city: "$city.city",
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: "$address",
//     },
//     {
//       $lookup: {
//         from: "cities",
//         localField: "transportCities",
//         foreignField: "_id",
//         as: "transportCities",
//         pipeline: [
//           {
//             $project: {
//               city: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         location: 0,
//         __v: 0,
//         products: 0,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "warehouse",
//         as: "manager",
//         pipeline: [
//           {
//             $match: {
//               role: "warehouseManager",
//             },
//           },
//           {
//             $project: {
//               name: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: "$manager",
//     },
//   ]);
//   sendResponse(res, warehouses, warehouses.length);
// });

const getWarehouse = getById(Warehouse, [
  {
    path: "address",
    select: "street city postalCode",
    populate: { path: "city", select: "city state country" },
  },
  {
    path: "transportCities",
    select: "city",
  },
]);
const createWarehouse = createOne(Warehouse, [
  "name",
  "address",
  "transportCities",
  "location",
]);

const updateWarehouse = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { id } = req.params;
  const { address, name } = req.body;

  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return next(new AppError(`Warehouse not found for id : ${id}`, 404));

  const warehouseAddress = await Address.findById(warehouse.address);
  if (!warehouseAddress)
    return next(new AppError(`No address found for warehouse id ${id}`, 404));

  if (address.postalCode) {
    if (!/^\d{6}$/.test(address.postalCode))
      return next(new AppError("Invalid postal code"));
    warehouseAddress.postalCode = address.postalCode;
  }
  if (address.street) warehouseAddress.street = address.street;
  if (address.city) {
    const cityExists = await City.findById(address.city);
    if (!cityExists)
      return next(new AppError(`No city found for city id ${address.city}`, 404));
    warehouseAddress.city = address.city;
  }
  await warehouseAddress.save();

  if (warehouse.name) warehouse.name = name;
  await warehouse.save();

  sendResponse(res, warehouse);
});

const updateTransportCities = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { transportCities: cities } = req.body;

  if (!Array.isArray(cities))
    return next(new AppError("transportCities must be an array", 400));

  const warehouse = await Warehouse.findByIdAndUpdate(
    id,
    {
      $addToSet: { transportCities: { $each: cities } },
    },
    { new: true }
  );

  if (!warehouse) return next(new AppError("No warehouse found", 404));
  res.status(200).json({
    status: "success",
    data: {
      warehouse,
    },
  });
});

const warehouseExists = catchAsync(async (req, res, next) => {
  const id = req.body.warehouse;
  if (!id) return next(new AppError("Please provide warehouse", 400));

  const warehouse = await Warehouse.findById(id);
  if (!warehouse)
    return next(
      new AppError(
        `No warehouse found with id : ${id}. Please provide valid warehouse id.`,
        404
      )
    );

  next();
});

const updateProductStock = catchAsync(async (req, res, next) => {
  const { productId, sku, stock } = req.body;
  if (!sku || !stock || stock < 0)
    return next(new AppError("Please provide valid sku and stock", 400));

  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse) return next(new AppError("Warehouse not found for user", 404));

  const productIndex = warehouse.products.findIndex((p) => p.product.equals(productId));
  if (productIndex === -1) return next(new AppError("Product not found", 404));

  const variantIndex = warehouse.products[productIndex].variants.findIndex(
    (v) => v.sku === sku
  );
  if (variantIndex === -1) return next(new AppError("Variant not found", 404));

  warehouse.products[productIndex].variants[variantIndex].stock = stock;
  await warehouse.save();
  sendResponse(res, warehouse);
});

const getUnassignedTransportCities = catchAsync(async (req, res, next) => {
  const warehouses = await Warehouse.find({}, { transportCities: 1 });
  const assignedCityIds = new Set(
    warehouses.flatMap((warehouse) => warehouse.transportCities)
  );

  const unassignedCities = await City.find(
    {
      _id: { $nin: Array.from(assignedCityIds) },
    },
    { city: 1 }
  );

  sendResponse(res, unassignedCities, unassignedCities.length);
});

const getUnassignedWarehouses = catchAsync(async (req, res, next) => {
  const warehouses = await Warehouse.find({}, { name: 1 }).populate({
    path: "manager",
    select: "name",
  });

  const unassignedWarehouses = warehouses.filter(
    (warehouse) => warehouse.manager === null
  );
  sendResponse(res, unassignedWarehouses, unassignedWarehouses.length);
});

const deleteWarehouse = getByIdAndDelete(Warehouse);

export {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  updateTransportCities,
  updateProductStock,
  warehouseExists,
  getUnassignedTransportCities,
  getUnassignedWarehouses,
  deleteWarehouse,
};
