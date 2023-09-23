const express = require("express");
const {
  Signup,
  Login,
  AddToDo,
  UpdateTodo,
  DeleteTodo,
  GetTodoList,
} = require("../controllers/userController");
const { AuthMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// sign up
router.post("/signup", Signup);

// login
router.post("/login", Login);

// get todo list
router.get("/todo-list", AuthMiddleware, GetTodoList);

// add todo
router.post("/add-todo", AuthMiddleware, AddToDo);

// updata todo
router.patch("/update-todo", AuthMiddleware, UpdateTodo);

// delete todo
router.delete("/delete-todo/:id", AuthMiddleware, DeleteTodo);

module.exports = router;
