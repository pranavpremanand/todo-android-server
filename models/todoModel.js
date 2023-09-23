const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    todo: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    done: Boolean,
    // date: new Date().toLocaleString(),
    date: String,
    time: String,
  },
  { timestamps: true }
);

const todoModel = mongoose.model("todo", todoSchema);
module.exports = todoModel;
