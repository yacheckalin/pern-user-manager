import express from "express";
import TokenController from "../controllers/token.controller.js";

const router = express.Router();
const tokenController = new TokenController();

router.delete("/:id", tokenController.deleteToken.bind(tokenController));

export default router;
