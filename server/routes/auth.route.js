import express from "express";
import { login, signUp } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/signUp").post(signUp);
router.route("/login").post(login);

export default router;
