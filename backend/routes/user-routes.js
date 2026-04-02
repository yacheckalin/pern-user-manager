import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAllUsers.bind(userController));
router.post("/", userController.createUser.bind(userController));

export default router;
