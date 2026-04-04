import express from "express";
import UserController from "../controllers/user.controller.js";
import { validate, userSchemas } from "../middleware/validation.js";

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAllUsers.bind(userController));

router.post(
  "/",
  validate(userSchemas.createUser),
  userController.createUser.bind(userController),
);

export default router;
