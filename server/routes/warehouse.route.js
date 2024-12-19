import express from "express";
import {
  createWarehouse,
  deleteWarehouse,
  getUnassignedTransportCities,
  getUnassignedWarehouses,
  getWarehouse,
  getWarehouses,
  updateProductStock,
  updateTransportCities,
  updateWarehouse,
} from "../controllers/warehouse.controller.js";
import { createAddress, updateAddress } from "../controllers/address.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").get(protect, getWarehouses).post(createAddress, createWarehouse);
router.route("/unassigned").get(getUnassignedWarehouses);
router.route("/unassigedCities").get(getUnassignedTransportCities);
router.route("/:id").get(getWarehouse).patch(updateWarehouse).delete(deleteWarehouse);
router.route("/:id/address/:addId").patch(updateAddress, updateWarehouse);
router.route("/:id/addTransportCities").patch(updateTransportCities);
router.route("/:id/updateProductStock").patch(updateProductStock);

export default router;
