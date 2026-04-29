import express from "express";
import UserController from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.js";
import { userSchemas } from "../schemas/user.schema.js";
import { verifyAccess } from "../middleware/auth-handler.js";

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAllUsers.bind(userController));
router.get(
  "/:id",
  validate(userSchemas.id),
  userController.getUser.bind(userController),
);
router.get(
  "/:id/tokens",
  validate(userSchemas.id),
  userController.getAllTokensByUser.bind(userController),
);

router.post(
  "/",
  validate(userSchemas.createUser),
  userController.createUser.bind(userController),
);

router.post(
  "/register",
  validate(userSchemas.registerUser),
  userController.registerUser.bind(userController),
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

router.post(
  "/:id/logout",
  validate(userSchemas.logoutUser),
  userController.logoutUser.bind(userController),
);

export default router;
