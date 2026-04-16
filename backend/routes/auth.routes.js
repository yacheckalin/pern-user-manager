import express from "express";
import AuthController from "../controllers/auth.controller.js";
import verifyRefreshToken from "../middleware/auth-handler.js";

const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.login.bind(authController));

router.post(
  "/logout",
  verifyRefreshToken,
  authController.logout.bind(authController),
);

router.post(
  "/refresh",
  verifyRefreshToken,
  authController.refresh.bind(authController),
);

export default router;
