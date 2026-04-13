import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import errorHandler from "./middleware/error-handler.js";
import db from './config/database.js';

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing HTTP server...');
  await db.end();
  process.exit(0);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server is puring on http://localhost:${PORT}`),
  );
}

export default app;
