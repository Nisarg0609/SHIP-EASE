import Address from "../models/address.model.js";
import City from "../models/city.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { filterObject } from "../utils/helper.js";
import { createOne, getById, getByIdAndUpdate, getMany } from "./factoryHandler.js";

const getAddresses = getMany(Address, { path: "city", select: "city state country" });
const getAddress = getById(Address, { path: "city", select: "city state country" });

const updateAddress = catchAsync(async (req, res, next) => {
  const { addId } = req.params;
  const filteredBody = filterObject(req.body, ["street", "city", "postalCode"]);
  const address = await Address.findByIdAndUpdate(addId, filteredBody, { new: true });
  req.body.address = address._id;
  next();
});

const createAddress = catchAsync(async (req, res, next) => {
  const { street, city, postalCode, isPrimary = false } = req.body.address;
  const cityExists = await City.findById(city);
  if (!cityExists)
    return next(new AppError("City does not exists, Please select another city.", 400));

  const address = await Address.create({ street, city, postalCode, isPrimary });
  req.body.address = address._id;
  next();
});

const updateDefaultAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const addressExists = await Address.findById(id);
  if (!addressExists) return next(new AppError("No address found", 404));

  await Address.updateMany({ isPrimary: true }, { $set: { isPrimary: false } });
  const updatedAddress = await Address.findByIdAndUpdate(id, { isPrimary: true });
  res.status(200).json({
    status: "success",
    data: {
      updatedAddress,
    },
  });
});

export { getAddresses, getAddress, createAddress, updateAddress, updateDefaultAddress };
