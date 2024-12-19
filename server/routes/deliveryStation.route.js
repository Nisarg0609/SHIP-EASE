import express from "express";
import {
  createDeliveryStation,
  deleteDeliveryStation,
  getDeliveryStation,
  getDeliveryStations,
  getUnassignedDeliveryStations,
  updateDeliveryStation,
} from "../controllers/deliveryStation.controller.js";
import { createAddress, updateAddress } from "../controllers/address.controller.js";

const router = express.Router();
router.route("/").get(getDeliveryStations).post(createAddress, createDeliveryStation);
router.route("/unassigned").get(getUnassignedDeliveryStations);
router
  .route("/:id")
  .get(getDeliveryStation)
  .patch(updateDeliveryStation)
  .delete(deleteDeliveryStation);
router.route("/:id/address/:addId").patch(updateAddress, updateDeliveryStation);

export default router;
