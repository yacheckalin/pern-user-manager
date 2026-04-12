import express from "express";
import UserController from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.js";
import { userSchemas } from "../schemas/user.schema.js";

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAllUsers.bind(userController));

router.post(
  "/",
  validate(userSchemas.createUser),
  userController.createUser.bind(userController),
);

router.put(
  "/:id",
  validate(userSchemas.updateUser),
  userController.updateUser.bind(userController),
);

router.patch(
  "/:id/password",
  validate(userSchemas.changePassword),
  userController.updateUserPassword.bind(userController),
);

router.delete(
  "/:id",
  validate(userSchemas.deleteUser),
  userController.deleteUser.bind(userController),
);

router.patch(
  "/:id/activate",
  validate(userSchemas.activateUser),
  userController.activateUser.bind(userController),
);

export default router;
