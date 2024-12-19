import express from "express";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../controllers/vehicle.controller.js";
import { warehouseExists } from "../controllers/warehouse.controller.js";

const router = express.Router();
router.route("/").get(getVehicles).post(warehouseExists, createVehicle);
router
  .route("/:id")
  .get(getVehicle)
  .patch(warehouseExists, updateVehicle)
  .delete(deleteVehicle);

export default router;
