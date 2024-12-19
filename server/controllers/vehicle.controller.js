import Vehicle from "../models/vehicle.model.js";
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

const createVehicle = catchAsync(async (req, res, next) => {
  const { vehicleNumber, type, warehouse } = req.body;
  if (!vehicleNumber || !type || !warehouse)
    return next(new AppError("Please provide Vehicle Number, Type and warehouse.", 400));

  const warehouseExists = await Warehouse.findById(warehouse);
  if (!warehouseExists)
    return next(new AppError(`No warehouse found for id ${warehouse}`));

  const vehicle = await Vehicle.create({ vehicleNumber, type, warehouse });
  sendResponse(res, vehicle, 1);
});

const getVehicles = getMany(Vehicle, { path: "warehouse", select: "name" });
const getVehicle = getById(Vehicle, { path: "warehouse", select: "name" });
const updateVehicle = getByIdAndUpdate(Vehicle, [
  "vehicleNumber",
  "type",
  "warehouse",
  "isAvailable",
  "isActive",
]);
const deleteVehicle = getByIdAndDelete(Vehicle);

export { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle };
