import Address from "../models/address.model.js";
import City from "../models/city.model.js";
import DeliveryStation from "../models/deliveryStation.model.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createOne,
  getById,
  getByIdAndDelete,
  getByIdAndUpdate,
  getMany,
  sendResponse,
} from "./factoryHandler.js";

const createDeliveryStation = createOne(DeliveryStation, ["name", "address", "location"]);
const getDeliveryStations = getMany(DeliveryStation, [
  {
    path: "address",
    select: "street city postalCode",
    populate: { path: "city", select: "city state country" },
  },
  {
    path: "manager",
    select: "name",
    match: { role: "deliveryStationManager" },
  },
]);
const getDeliveryStation = getById(DeliveryStation, {
  path: "address",
  select: "street city postalCode",
  populate: { path: "city", select: "city state country" },
});
// const updateDeliveryStation = getByIdAndUpdate(DeliveryStation, [
//   "name",
//   "address",
//   "location",
//   "isActive",
// ]);

const updateDeliveryStation = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { id } = req.params;
  const { address, name } = req.body;

  const deliveryStation = await DeliveryStation.findById(id);
  if (!deliveryStation)
    return next(new AppError(`Delivery Station not found for id : ${id}`, 404));

  const deliveryStationAddress = await Address.findById(deliveryStation.address);
  if (!deliveryStationAddress)
    return next(new AppError(`No address found for deliveryStation id ${id}`, 404));

  if (address.postalCode) {
    if (!/^\d{6}$/.test(address.postalCode))
      return next(new AppError("Invalid postal code"));
    deliveryStationAddress.postalCode = address.postalCode;
  }
  if (address.street) deliveryStationAddress.street = address.street;
  if (address.city) {
    const cityExists = await City.findById(address.city);
    if (!cityExists)
      return next(new AppError(`No city found for city id ${address.city}`, 404));
    deliveryStationAddress.city = address.city;
  }
  await deliveryStationAddress.save();

  if (deliveryStation.name) deliveryStation.name = name;
  await deliveryStation.save();

  sendResponse(res, deliveryStation);
});

const getUnassignedDeliveryStations = catchAsync(async (req, res, next) => {
  const deliveryStations = await DeliveryStation.find({}, { name: 1 }).populate({
    path: "manager",
    select: "name",
  });

  const unassignedDeliveryStations = deliveryStations.filter(
    (deliveryStation) => deliveryStation.manager === null
  );

  sendResponse(res, unassignedDeliveryStations, unassignedDeliveryStations.length);
});

const deleteDeliveryStation = getByIdAndDelete(DeliveryStation);

export {
  createDeliveryStation,
  getDeliveryStations,
  getDeliveryStation,
  updateDeliveryStation,
  deleteDeliveryStation,
  getUnassignedDeliveryStations,
};
