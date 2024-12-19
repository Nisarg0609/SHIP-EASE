import express from "express";
import {
  addPincodes,
  createCities,
  createCity,
  deleteCity,
  getCities,
  getCity,
  updateCity,
} from "../controllers/city.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").get(getCities).post(protect, restrictTo("admin"), createCity);
router.route("/:id/pincodes").patch(addPincodes);
router.route("/:id").get(getCity).patch(updateCity).delete(deleteCity);
router.route("/create-many-cities").post(createCities);

export default router;
