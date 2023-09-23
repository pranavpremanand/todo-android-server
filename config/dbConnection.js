const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection
  .on("connected", () => console.log("DB connected successfully"))
  .on("error", (err) => console.log("DB connection error"));
