import express from "express";
import {
  createAddress,
  getAddress,
  getAddresses,
  updateAddress,
  updateDefaultAddress,
} from "../controllers/address.controller.js";

const router = express.Router();
router.route("/").get(getAddresses);
router.route("/:id").get(getAddress).patch(updateAddress);
router.route("/:id/default").patch(updateDefaultAddress);

export default router;
