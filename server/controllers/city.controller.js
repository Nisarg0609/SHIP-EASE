import City from "../models/city.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createMany,
  createOne,
  getById,
  getByIdAndDelete,
  getMany,
  sendResponse,
  updateOne,
} from "./factoryHandler.js";

const createCity = createOne(City, ["city", "state", "country", "pincodes"]);
const createCities = createMany(City, ["city", "state", "country", "pincodes"]);
const getCities = getMany(City);
const getCity = getById(City);
const updateCity = updateOne(City, ["city", "state", "country", "pincodes", "isActive"]);
const deleteCity = getByIdAndDelete(City);

const addPincodes = catchAsync(async (req, res, next) => {
  const { pincodes } = req.body;
  if (!pincodes || !Array.isArray(pincodes) || pincodes?.length === 0)
    return next(new AppError("Please provide valid pincodes array", 400));

  const invalidPincodes = pincodes.filter((pincode) => !/^[0-9]{6}$/.test(pincode));
  if (invalidPincodes.length > 0) {
    return next(new AppError("All pincodes must be 6-digit numbers", 400));
  }

  const city = await City.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { pincodes: { $each: pincodes } },
    },
    { new: true, runValidators: true }
  );
  if (!city) return next(new AppError("city no found", 404));

  sendResponse(res, city);
});

export {
  createCity,
  createCities,
  getCities,
  getCity,
  updateCity,
  deleteCity,
  addPincodes,
};
