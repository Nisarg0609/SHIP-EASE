import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import City from "../models/city.model.js";
import User from "../models/user.model.js";
import Warehouse from "../models/warehouse.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { getMany, sendResponse } from "./factoryHandler.js";
import Order from "../models/order.model.js";
import DeliveryStation from "../models/deliveryStation.model.js";
import Vehicle from "../models/vehicle.model.js";
import Product from "../models/product.model.js";

const isStockAvailableInWarehouse = catchAsync(async (req, res, next) => {
  const { postalCode, addressId } = req.body;
  let pincode;
  let address;
  let user;
  if (!postalCode) {
    if (!addressId) {
      return next(new AppError("Please provide addressId or postalCode", 400));
    }
    user = await User.findById(req.user._id).populate("address");

    address = user.address.filter((add) => add._id.equals(addressId))[0];
    if (!address)
      return next(new AppError("Please provide valid addressId or postalCode.", 400));
    pincode = address.postalCode;
  } else {
    pincode = postalCode;
  }

  const city = await City.findOne({ pincodes: pincode });
  if (!city) return next(new AppError("Not Deliverable", 404));

  const warehouse = await Warehouse.findOne({ transportCities: city._id });
  if (!warehouse) return next(new AppError("Not Deliverable", 404));

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name"
  );
  if (!cart || cart.items.length === 0) return next(new AppError("Cart is empty", 404));

  // Check stock for each item in the cart
  for (const cartItem of cart.items) {
    const productInWarehouse = warehouse.products.find((warehouseProduct) =>
      warehouseProduct.product.equals(cartItem.product._id)
    );

    if (!productInWarehouse)
      return next(
        new AppError(
          `Product ${cartItem.product.name} is not available in the warehouse`,
          404
        )
      );

    // Check each variant stock in the warehouse against required stock in the cart
    for (const cartVariant of cartItem.variants) {
      const variantInWarehouse = productInWarehouse.variants.find(
        (warehouseVariant) => warehouseVariant.sku === cartVariant.variantSku
      );

      if (!variantInWarehouse)
        return next(
          new AppError(
            `Variant SKU ${cartVariant.variantSku} of product ${cartItem.product.name} is not in the warehouse`,
            404
          )
        );
      if (variantInWarehouse.stock < cartVariant.variantStock) {
        return next(
          new AppError(
            `Insufficient stock for SKU ${cartVariant.variantSku} of product ${cartItem.product.name}. Available Stock: ${variantInWarehouse.stock}`,
            404
          )
        );
      }
    }
  }
  req.body.warehouse = warehouse;
  req.body.address = address;
  req.body.city = city;
  req.body.cart = cart;
  req.body.user = user;
  next();
});

const checkProductAvailability = (req, res, next) => {
  sendResponse(res, true);
};

const placeOrder = catchAsync(async (req, res, next) => {
  const { user, address, city, warehouse } = req.body;

  const cart = await Cart.findOne({ user: user._id }).populate("items.product");
  const deliveryStation = await DeliveryStation.findOne().populate({
    path: "address",
    match: { city: city._id },
    select: "city street postalCode",
  });

  const items = [];
  let totalAmount = 0;
  let totalWeight = 0;
  let totalVolume = { length: 0, width: 0, height: 0 };

  for (let item of cart.items) {
    const { product, variants } = item;

    const warehouseProduct = await Warehouse.findOne({
      _id: warehouse._id,
      "products.product": product._id,
    });
    if (!warehouseProduct) {
      throw new Error(
        `Product ${product.name} is unavailable in the selected warehouse.`
      );
    }

    for (let variant of variants) {
      const warehouseVariant = warehouseProduct.products
        .find((p) => p.product.equals(product._id))
        .variants.find((v) => v.sku === variant.variantSku);

      if (!warehouseVariant || warehouseVariant.stock < variant.variantStock) {
        throw new Error(`Insufficient stock for ${product.name} - ${variant.variantSku}`);
      }

      const productVariant = product.variants.find((v) => v.sku === variant.variantSku);
      if (!productVariant) {
        throw new Error(
          `Variant SKU ${variant.variantSku} not found for product ${product.name}`
        );
      }

      const price = productVariant.price;
      const discount = productVariant.discount || 0;
      const totalPrice = variant.variantStock * price * (1 - discount / 100);

      totalWeight += product.weight * variant.variantStock;
      totalVolume.length += product.dimensions.length * variant.variantStock;
      totalVolume.width += product.dimensions.width * variant.variantStock;
      totalVolume.height += product.dimensions.height * variant.variantStock;
      totalAmount += totalPrice;

      items.push({
        product: product._id,
        variant: variant.variantSku,
        quantity: variant.variantStock,
        price,
        discount,
        totalPrice,
      });
    }
  }

  const order = new Order({
    customer: user._id,
    items,
    deliveryCost: 40,
    totalAmount: totalAmount + 40,
    shippingAddress: address._id,
    deliveryStation: deliveryStation._id,
    warehouse: warehouse._id,
    totalWeight,
    totalVolume,
  });
  await order.save();

  for (let item of cart.items) {
    for (let variant of item.variants) {
      await Warehouse.updateOne(
        {
          _id: warehouse._id,
          "products.product": item.product._id,
          "products.variants.sku": variant.variantSku,
        },
        {
          $inc: {
            "products.$[product].variants.$[variant].stock": -variant.variantStock,
          },
        },
        {
          arrayFilters: [
            { "product.product": item.product._id },
            { "variant.sku": variant.variantSku },
          ],
        }
      );
    }
  }

  await Cart.deleteOne({ user: user._id });
  sendResponse(res, order);
});

const getOrdersForManager = catchAsync(async (req, res, next) => {
  const user = req.user;
  let orders;
  if (user.role === "warehouseManager") {
    orders = await Order.find({
      warehouse: user.warehouse,
      assignmentStatus: "Not Assigned",
    });
  } else if (user.role === "deliveryStationManager") {
    orders = await Order.find({
      deliveryStation: user.deliveryStation,
      assignmentStatus: "Delivered to Delivery Station",
    });
  }
  if (!orders.length) return next(new AppError("Orders not Found", 404));
  sendResponse(res, orders);
});

const assignOrdersToWarehouseDriver = catchAsync(async (req, res, next) => {
  const { orders, vehicleId, driverId } = req.body;
  const warehouse = req.user.warehouse;

  // validate vehicle
  const vehicle = await Vehicle.findOne({ _id: vehicleId, warehouse });
  if (!vehicle)
    return next(
      new AppError("Vehicle not found. Please provide vehicle of your warehouse", 404)
    );
  if (!vehicle.isAvailable) return next(new AppError("Vehicle is not available", 400));

  // validate driver
  const driver = await User.findOne({
    _id: driverId,
    warehouse,
    role: "warehouseDriver",
  });
  if (!driver)
    return next(
      new AppError("Driver not found. Please provide driver of your warehouse", 404)
    );
  if (!driver.isDriverAvailable)
    return next(new AppError("Driver is not available", 400));

  // validate orders
  if (!Array.isArray(orders) || orders.length === 0)
    return next(new AppError("Please provide valid orders array.", 400));

  const assignedOrders = await Promise.all(
    orders.map(async (order) => {
      const ord = await Order.findOne({
        _id: order,
        warehouse,
        assignmentStatus: "Not Assigned",
      });
      if (!ord)
        return next(
          new AppError(
            `Order with id ${order} not found Or has been already assigned.`,
            400
          )
        );
      return ord;
    })
  );
  if (assignedOrders.length !== orders.length)
    return next(
      new AppError(`Some orders are not found Or has been already assigned.`, 400)
    );

  let totalWeightOfOrders = 0;
  let totalVolumeOfOrders = { length: 0, width: 0, height: 0 };

  // validate vehicle weight capacity
  assignedOrders.map((order) => {
    totalWeightOfOrders += order.totalWeight;
    totalVolumeOfOrders.length += order.totalVolume.length;
    totalVolumeOfOrders.width += order.totalVolume.width;
    totalVolumeOfOrders.height += order.totalVolume.height;
  });
  if (totalWeightOfOrders > vehicle.weightCapacity)
    return next(
      new AppError(
        `Total weight of Orders (${totalWeightOfOrders} kg) exceeds vehicle weight capacity of ${vehicle.weightCapacity} kg`,
        400
      )
    );

  // validate vehicle dimension capacity
  const ordersVolume =
    totalVolumeOfOrders.length * totalVolumeOfOrders.width * totalVolumeOfOrders.height;
  const vehicleVolume =
    vehicle.dimensions.length * vehicle.dimensions.width * vehicle.dimensions.height;
  if (ordersVolume > vehicleVolume)
    return next(
      new AppError("Total volume of Orders exceed vehicle volume capacity", 400)
    );

  const updatedOrders = await Promise.all(
    orders.map(
      async (order) =>
        await Order.findByIdAndUpdate(order, {
          orderStatus: "Shipped",
          assignmentStatus: "Assigned to Warehouse Driver",
          warehouseDriver: driverId,
          vehicle: vehicleId,
          assignedToWarehouseDriverAt: Date.now(),
        })
    )
  );

  await User.findByIdAndUpdate(driverId, { isDriverAvailable: false });
  await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: false });

  sendResponse(res, updatedOrders);
});

const assignOrdersToDeliveryStationDriver = catchAsync(async (req, res, next) => {
  const { orders, driverId } = req.body;
  const deliveryStation = req.user.deliveryStation;

  // validate driver
  const driver = await User.findOne({
    _id: driverId,
    deliveryStation,
    role: "deliveryStationDriver",
  });
  if (!driver)
    return next(
      new AppError("Driver not found. Please provide driver of your warehouse", 404)
    );
  if (!driver.isDriverAvailable)
    return next(new AppError("Driver is not available", 400));

  // validate orders
  if (!Array.isArray(orders) || orders.length === 0)
    return next(new AppError("Please provide valid orders array.", 400));
  if (orders.length > 50)
    return next(new AppError("You can assign up to 50 orders per driver.", 400));

  const assignedOrders = await Promise.all(
    orders.map(async (order) => {
      const ord = await Order.findOne({
        _id: order,
        deliveryStation,
        assignmentStatus: "Delivered to Delivery Station",
      });
      if (!ord)
        return next(
          new AppError(
            `Order with id ${order} not found Or has been already assigned.`,
            400
          )
        );
      return ord;
    })
  );
  if (assignedOrders.length !== orders.length)
    return next(
      new AppError(`Some orders are not found Or has been already assigned.`, 400)
    );

  const updatedOrders = await Promise.all(
    orders.map(
      async (order) =>
        await Order.findByIdAndUpdate(order, {
          orderStatus: "Out for Delivery",
          assignmentStatus: "Assigned to Delivery Station Driver",
          deliveryStationDriver: driverId,
          assignedToDeliveryStationDriverAt: Date.now(),
        })
    )
  );

  await User.findByIdAndUpdate(driverId, { isDriverAvailable: false });
  sendResponse(res, updatedOrders);
});

const getAssignedOrdersForDriver = catchAsync(async (req, res, next) => {
  const user = req.user;
  let orders;
  if (user.role === "warehouseDriver") {
    orders = await Order.find({
      warehouseDriver: user._id,
      assignmentStatus: "Assigned to Warehouse Driver",
    }).sort("deliveryStation");
  } else if (user.role === "deliveryStationDriver") {
    orders = await Order.find({
      deliveryStationDriver: user._id,
      assignmentStatus: "Assigned to Delivery Station Driver",
    }).sort("shippingAddress");
  }
  if (!orders) return next(new AppError("Orders not Found", 404));
  sendResponse(res, orders);
});

export {
  placeOrder,
  checkProductAvailability,
  isStockAvailableInWarehouse,
  getOrdersForManager,
  assignOrdersToWarehouseDriver,
  getAssignedOrdersForDriver,
  assignOrdersToDeliveryStationDriver,
};
