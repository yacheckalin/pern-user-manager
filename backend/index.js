import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import authRoutes from "./routes/auth.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import errorHandler from "./middleware/error-handler.js";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import { API_PREFIX, API_VERSION, HTTP_INTERNAL_SERVER_ERROR } from "./constants/index.js";
import logger from "./logger.js";
import morganMiddleware from "./middleware/morgan.js";
import metrics from "./middleware/metrics.js";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import ApiError from "./errors/api.error.js";

const { PORT } = process.env;
const API_URL = API_PREFIX + "/" + API_VERSION;
const swaggerDocument = YAML.load("./openapi.yml");

const app = express();

const whitelist = ['http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ApiError({ message: 'Not allowed by CORS', status: HTTP_INTERNAL_SERVER_ERROR }));
    }
  },
  exposedHeaders: ['x-total-count'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);

app.use(`${API_URL}/metrics`, metricsRoutes);
app.use(metrics());

app.use(`${API_URL}/users`, userRoutes);
app.use(`${API_URL}/auth`, authRoutes);
app.use(`${API_URL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
