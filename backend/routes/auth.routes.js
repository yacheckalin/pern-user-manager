import express from 'express';
import AuthController from '../controllers/auth.controller.js';


const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController))

export default router;