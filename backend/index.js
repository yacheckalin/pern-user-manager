const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).send("Express works properly!");
});

app.listen(PORT, () =>
  console.log(`Server is puring on http://localhost:${PORT}`),
);
