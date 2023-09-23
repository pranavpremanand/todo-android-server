const express = require("express");
const app = express();
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");
const morgan= require('morgan')
require("./config/dbConnection");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection
  .on("connected", () => console.log("DB connected successfully"))
  .on("error", (err) => console.log("DB connection error"));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(5000);

app.use("/", routes);
