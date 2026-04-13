import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import errorHandler from "./middleware/error-handler.js";

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server is puring on http://localhost:${PORT}`),
  );
}

export default app;
