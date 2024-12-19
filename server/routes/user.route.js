import express from "express";
import {
  checkUserType,
  checkManagerAlredyExists,
  createManager,
  getUserById,
  getUsers,
  createDriver,
  checkDriverLicense,
  addUserAddress,
  removeUserAddress,
  getUserAddress,
  updateDefaultAddress,
  createAndSendOtpToManager,
  verifyManagerOtp,
  createAndSendOtpToCustomer,
  verifyCustomerOTP,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").get(getUsers);
router.route("/getUser").get(getUser);
router.route("/address").get(protect, getUserAddress);
router.route("/:id/manager").patch(updateUser);
router.route("/:id").get(getUserById).delete(deleteUser);
router.route("/manager").post(checkUserType, checkManagerAlredyExists, createManager);
router.route("/driver").post(checkDriverLicense, checkUserType, createDriver);
router.route("/address/add").post(protect, addUserAddress);
router.route("/address/:addressId/remove").patch(protect, removeUserAddress);
router.route("/address/:addressId/default").patch(protect, updateDefaultAddress);
router.route("/manager/sendOTP").post(protect, createAndSendOtpToManager);
router.route("/manager/verifyOTP").post(protect, verifyManagerOtp);
router.route("/customer/sendOTP").post(protect, createAndSendOtpToCustomer);
router.route("/customer/verifyOTP").post(protect, verifyCustomerOTP);

export default router;
