const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require("./shared/error-handler");
const userRoutes = require("./routes/user-routes");

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server is puring on http://localhost:${PORT}`),
);
