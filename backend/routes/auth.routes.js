import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authRefreshToken from '../middleware/auth-handler.js';

const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.login.bind(authController));
router.post("/logout", authRefreshToken, authController.logout.bind(authController))

export default router;