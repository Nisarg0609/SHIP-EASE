import express from "express";
import {
  checkProductAvailability,
  assignOrdersToWarehouseDriver,
  getOrdersForManager,
  getAssignedOrdersForDriver,
  isStockAvailableInWarehouse,
  placeOrder,
  assignOrdersToDeliveryStationDriver,
} from "../controllers/order.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const router = express.Router();
router
  .route("/checkAvailability")
  .post(protect, isStockAvailableInWarehouse, checkProductAvailability);
router.route("/place").post(protect, isStockAvailableInWarehouse, placeOrder);
router.route("/manager").get(protect, getOrdersForManager);
router
  .route("/warehouse-manager/assign")
  .post(protect, restrictTo("warehouseManager"), assignOrdersToWarehouseDriver);
router
  .route("/deliveryStation-manager/assign")
  .post(
    protect,
    restrictTo("deliveryStationManager"),
    assignOrdersToDeliveryStationDriver
  );
router.route("/driver").get(protect, getAssignedOrdersForDriver);

export default router;
