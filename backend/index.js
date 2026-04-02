const express = require("express");
const cors = require("cors");
require("dotenv").config();
const UserController = require("./controllers/user.controller");
const errorHandler = require("./shared/error-handler");

const { PORT } = process.env;

const app = express();
const userController = new UserController();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/", (req, res) => {
  res.status(200).send("Express works properly!");
});

app.get("/users", userController.getAllUsers.bind(userController));

app.listen(PORT, () =>
  console.log(`Server is puring on http://localhost:${PORT}`),
);
