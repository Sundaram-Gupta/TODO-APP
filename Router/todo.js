const {getTodos,setTodos,updateTodos,deleteTodos,updateStatusTodos,getStatusUpdatedTodos} = require("../Controller/todo")
const express = require("express");
const Router = express.Router();

Router.get("/get", getTodos);

Router.post("/set", setTodos);

Router.put("/update/:id", updateTodos);

Router.delete("/delete/:id", deleteTodos);

Router.put("/update/status/:id", updateStatusTodos);

Router.get("/get/status", getStatusUpdatedTodos)

module.exports = Router;