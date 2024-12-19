import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Address from "../models/address.model.js";
import City from "../models/city.model.js";
import User from "../models/user.model.js";
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
import { sendEmail } from "../utils/sendEmail.js";
import Order from "../models/order.model.js";
import DeliveryStation from "../models/deliveryStation.model.js";
import Vehicle from "../models/vehicle.model.js";
import { filterObject } from "../utils/helper.js";
import Warehouse from "../models/warehouse.model.js";

const checkManagerAlredyExists = catchAsync(async (req, res, next) => {
  const { warehouse, deliveryStation } = req.body;
  if (warehouse) {
    const managerExists = await User.findOne({
      warehouse,
      role: "warehouseManager",
    });
    if (managerExists)
      return next(new AppError("Manager already exists for this Warehouse.", 400));
  }
  if (deliveryStation) {
    const managerExists = await User.findOne({
      deliveryStation,
      role: "deliveryStationManager",
    });
    if (managerExists)
      return next(new AppError("Manager already exists for this Delivery Station.", 400));
  }
  next();
});

const checkUserType = catchAsync(async (req, res, next) => {
  const { warehouse, deliveryStation } = req.body;
  if (!warehouse && !deliveryStation)
    return next(
      new AppError(
        "Warehouse Id or Delivery Station Id is required to add a manager.",
        400
      )
    );
  if (warehouse && deliveryStation)
    return next(
      new AppError(
        "Please provide either Warehouse Id or Delivery Station Id. You cannot pass both.",
        400
      )
    );
  next();
});

const checkDriverLicense = catchAsync(async (req, res, next) => {
  const { driverLicenseNumber } = req.body;
  if (!driverLicenseNumber)
    return next(new AppError("Please provide driver license number", 400));
  next();
});

const createManager = createOne(User, [
  "name",
  "email",
  "password",
  "passwordConfirm",
  "dateOfBirth",
  "gender",
  "phone",
  "warehouse",
  "deliveryStation",
]);

const createDriver = createOne(User, [
  "name",
  "email",
  "password",
  "passwordConfirm",
  "dateOfBirth",
  "gender",
  "phone",
  "warehouse",
  "deliveryStation",
  "driverLicenseNumber",
]);

const getUsers = getMany(User, [
  { path: "warehouse", select: "name" },
  { path: "deliveryStation", select: "name" },
]);

const getUserById = getById(User, [
  { path: "warehouse", select: "name" },
  { path: "deliveryStation", select: "name" },
]);

const getUser = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("No Token Provided"));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) return next(new AppError("Invalid token or token has been expired", 400));

  const user = await User.findById(decoded.id);
  if (!user)
    return next(new AppError("User belonging to this token does no longer exists.", 400));
  sendResponse(res, user);
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = ["name", "email", "gender", "phone", "dateOfBirth"];
  const filteredBody = filterObject(req.body, allowedFields);

  const user = await User.findByIdAndUpdate(id, filteredBody, { new: true });
  if (!user) return next(new AppError(`No user found for ${id}`, 404));
  sendResponse(res, user, 1);
});

const addUserAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.address && user.address.length === 5)
    return next(new AppError("You can not have more than 5 address.", 400));

  const { street, city, postalCode } = req.body;
  const cityExists = await City.findById(city);
  if (!cityExists)
    return next(new AppError("City does not exists, Please select another city.", 400));

  const address = await Address.create({ street, city, postalCode });
  await User.findByIdAndUpdate(req.user._id, {
    $push: { address },
    $slice: { address: 5 },
  });
  sendResponse(res, address);
});

const getUserAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("address");
  sendResponse(res, user.address);
});

const removeUserAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const userExists = await User.findById(req.user._id);
  if (!userExists.address || userExists.address.length === 0)
    return next(new AppError("You do not have any address saved", 400));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { address: addressId } },
    { new: true }
  );
  sendResponse(res, user.address);
});

const updateDefaultAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const addressExists = await Address.findById(addressId);
  if (!addressExists) return next(new AppError("No address found", 404));

  await Address.updateMany({ isPrimary: true }, { $set: { isPrimary: false } });
  const updatedAddress = await Address.findByIdAndUpdate(addressId, { isPrimary: true });
  sendResponse(res, updatedAddress);
});

const createAndSendOtpToManager = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    warehouseDriver: req.user._id,
    assignmentStatus: "Assigned To Warehouse Driver",
  });
  if (!orders.length)
    return next(new AppError("You don't have any assigned orders to send OTP.", 404));

  const { deliveryStationId } = req.body;
  if (!deliveryStationId)
    return next(new AppError("Please provide a delivery station id.", 400));

  const manager = await User.findOne({
    deliveryStation: deliveryStationId,
    role: "deliveryStationManager",
  });
  if (!manager)
    return next(new AppError("please provide valid delivery station id.", 400));

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const info = await sendEmail(manager._id, otp);
  if (!info)
    return next(new AppError("Failed to send email. Please try again later.", 500));

  await User.findByIdAndUpdate(manager._id, {
    otp: hashedOtp,
    otpExpiresIn: Date.now() + 10 * 60 * 1000,
  });
  sendResponse(res, info);
});

const verifyManagerOtp = catchAsync(async (req, res, next) => {
  const { otp, deliveryStationId } = req.body;
  if (!deliveryStationId)
    return next(new AppError("Please provide delivery station Id", 400));
  const deliveryStation = await DeliveryStation.findById(deliveryStationId);
  if (!deliveryStation)
    return next(new AppError("Please provide valid delivery station Id", 400));

  const orders = await Order.find({
    warehouseDriver: req.user._id,
    assignmentStatus: "Assigned to Warehouse Driver",
    deliveryStation: deliveryStationId,
  }).select("_id");
  if (!orders || !orders.length)
    return next(new AppError("No orders found for this delivery station.", 400));

  const manager = await User.findOne({
    deliveryStation: deliveryStationId,
    role: "deliveryStationManager",
  }).select("opt otpExpiresIn");
  if (!manager)
    return next(new AppError("No manager found for provided delivery station id", 404));

  if (Date.now() > manager.otpExpiresIn) throw new Error("OTP expired or invalid");

  if (!manager.otp)
    return next(
      new AppError("Please send OTP to delivery station manager to verify.", 400)
    );

  const isOtpValid = await bcrypt.compare(otp, manager.otp);
  if (!isOtpValid) return next(new AppError("Invalid OTP", 400));

  // change status of orders
  await Promise.all(
    orders.map(async (order) => {
      await Order.findByIdAndUpdate(order, {
        orderStatus: "Arrived at Delivery Station",
        assignmentStatus: "Deliverd to Delivery Station",
      });
    })
  );

  // change availability of driver and vehicle if all orders are delivered
  const pendingOrders = await Order.find({
    warehouseDriver: req.user._id,
    assignmentStatus: "Assigned to Warehouse Driver",
  });
  if (pendingOrders.length === 0) {
    await User.findByIdAndUpdate(req.user._id, {
      isDriverAvailable: true,
    });

    const order = await Order.findById(orders[0]);
    const vehicleId = order.vehicle;
    await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: true });
  }

  await User.findByIdAndUpdate(manager._id, { otp: null, optExpiresIn: null });
  sendResponse(res, isOtpValid);
});

const createAndSendOtpToCustomer = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    deliveryStationDriver: req.user._id,
    assignmentStatus: "Assigned to Delivery Station Driver",
  });
  if (!orders.length)
    return next(new AppError("You don't have any assigned orders to send OTP.", 404));

  const { orderId } = req.body;
  if (!orderId) return next(new AppError("Please provide a order id.", 400));

  const order = await Order.findOne({ _id: orderId, orderStatus: "Out for Delivery" });
  if (!order)
    return next(
      new AppError(`Order not found or Order has been already delivered.`, 400)
    );

  const customerId = order.customer;
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const info = await sendEmail(customerId, otp);
  if (!info)
    return next(new AppError("Failed to send email. Please try again later.", 500));

  await User.findByIdAndUpdate(customerId, {
    otp: hashedOtp,
    otpExpiresIn: Date.now() + 10 * 60 * 1000,
  });
  sendResponse(res, info);
});

const verifyCustomerOTP = catchAsync(async (req, res, next) => {
  const { otp, orderId } = req.body;
  if (!orderId) return next(new AppError("Please provide order Id", 400));

  const order = await Order.findOne({ _id: orderId, orderStatus: "Out for Delivery" });
  if (!order) return next(new AppError("Please provide valid order Id", 400));

  const customer = await User.findById(order.customer).select("otp otpExpiresIn");
  if (!customer || Date.now() > customer.otpExpiresAt)
    throw new Error("OTP expired or invalid");

  if (!customer.otp)
    return next(new AppError("Please send OTP to customer to verify.", 400));

  const isOtpValid = await bcrypt.compare(otp, customer.otp);
  if (!isOtpValid) return next(new AppError("Invalid OTP", 400));

  // change status of orders

  await Order.findByIdAndUpdate(order._id, {
    orderStatus: "Delivered",
    assignmentStatus: "Delivered",
  });
  await User.findByIdAndUpdate(customer._id, {
    otp: null,
    otpExpiresIn: null,
  });

  const pendingOrders = await Order.find({
    deliveryStationDriver: req.user._id,
    assignmentStatus: "Assigned to Delivery Station Driver",
  });
  if (pendingOrders.length === 0) {
    await User.findByIdAndUpdate(req.user._id, {
      isDriverAvailable: true,
    });
  }

  sendResponse(res, isOtpValid);
});

const deleteUser = getByIdAndDelete(User);

export {
  checkUserType,
  checkManagerAlredyExists,
  checkDriverLicense,
  createManager,
  createDriver,
  getUsers,
  getUser,
  getUserById,
  updateUser,
  addUserAddress,
  getUserAddress,
  removeUserAddress,
  updateDefaultAddress,
  createAndSendOtpToManager,
  verifyManagerOtp,
  createAndSendOtpToCustomer,
  verifyCustomerOTP,
  deleteUser,
};
