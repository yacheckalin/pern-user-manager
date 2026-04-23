import { register } from "prom-client";
import asyncHandler from "../middleware/async-handler.js";

class MetricsController {
  constructor() {}
  getMetrics = asyncHandler(async (req, res, next) => {
    try {
      res.setHeader("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (e) {
      next(e);
    }
  });
}

export default MetricsController;
