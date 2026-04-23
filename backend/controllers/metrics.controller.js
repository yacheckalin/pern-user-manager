import { register } from "prom-client";
import asyncHandler from "../middleware/async-handler.js";

class MetricsController {
  constructor() {
    metrics = asyncHandler(async (req, res) => {
      res.setHeader("Content-Type", register.contentType);
      res.end(await register.metrics());
    });
  }
}

export default MetricsController;
