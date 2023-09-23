const todoModel = require("../models/todoModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup
exports.Signup = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(200).json({ success: false, message: "Email already exist" });
    } else {
      password = await bcrypt.hash(password, 10);
      email = email.toLowerCase();
      const user = userModel({ name, email, password });
      user.save().then((data) => {
        const accessToken = jwt.sign(
          { userId: data._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 60 * 24 * 365,
          }
        );
        res.status(201).json({
          success: true,
          message: "User successfully created 🤩",
          accessToken,
          data,
        });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// login
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const passMatched = await bcrypt.compare(password, user.password);
      if (passMatched) {
        const accessToken = jwt.sign(
          { userId: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 60 * 24 * 365,
          }
        );
        res.status(200).json({
          success: true,
          message: "Login successful 🤩",
          accessToken,
          data: user,
        });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Incorrect password ☹️" });
      }
    } else {
      res.status(200).json({ success: false, message: "User doesn't exist 🫣" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// add todo
exports.AddToDo = async (req, res) => {
  try {
    const currentDate = new Date();
    // Get the date in "MM/DD/YYYY" format
    const date = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;

    // Get the time in "hh:mm a" format
    const hours = currentDate.getHours() % 12 || 12; // Convert 0 to 12 for 12-hour format
    const minutes = currentDate.getMinutes();
    const ampm = currentDate.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;

    const todo = todoModel({
      ...req.body,
      date,
      time,
      userId: req.userId,
      done: false,
    });
    const data = await todo.save();

    res.status(201).json({ success: true, message: "Todo created 😍", data });
  } catch (err) {
    res.status(500).json(err);
  }
};

// get todo list
exports.GetTodoList = async (req, res) => {
  try {
    const todos = await todoModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: todos,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// update todo status
exports.UpdateTodo = async (req, res) => {
  try {
    const { todoId, status } = req.body;
    await todoModel.updateOne({ _id: todoId }, { done: status });
    res
      .status(200)
      .json({ success: true, message: "Todo updated successfully 😉" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete todo
exports.DeleteTodo = async (req, res) => {
  try {
    await todoModel.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully 🫡" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
