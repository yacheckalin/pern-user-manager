import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import authRoutes from "./routes/auth.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import errorHandler from "./middleware/error-handler.js";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import { API_PREFIX, API_VERSION } from "./constants/index.js";
import logger from "./logger.js";
import morganMiddleware from "./middleware/morgan.js";
import metrics from "./middleware/metrics.js";
const { PORT } = process.env;

const API_URL = API_PREFIX + "/" + API_VERSION;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);

app.use(`${API_URL}/metrics`, metricsRoutes);
app.use(metrics());

app.use(`${API_URL}/users`, userRoutes);
app.use(`${API_URL}/auth`, authRoutes);

app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing HTTP server...");
  await db.end();
  process.exit(0);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    logger.info(`Server is puring on http://localhost:${PORT}`),
  );
}

export default app;
