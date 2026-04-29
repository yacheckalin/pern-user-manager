import express from "express";

const router = express.Router();
const tokenController = new TokenController();

router.get("/", tokenController.getAll.bind(tokenController));

router.delete("/:id", tokenController.deleteToken.bind(tokenController));

export default router;
