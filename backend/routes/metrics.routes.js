import express from "express";
import MetricsController from "../controllers/metrics.controller.js";

const router = express.Router();
const metricsController = new MetricsController();

router.get("/", metricsController.getMetrics.bind(metricsController));

export default router;
