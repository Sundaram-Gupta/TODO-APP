const cors = require("cors");
const express = require("express");

const connectDB = require("./connection");
const todoRouter = require("./Router/todo")

const app = express();
const PORT = 4000;

//Database connection
connectDB("mongodb://127.0.0.1:27017/TODO_APP")
.then(()=> console.log("MongoDB connected successfully!"))
.catch((error)=> console.log(error.message))

app.use(cors());
app.use(express.json());

app.use("/todos",todoRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to To-Do Application Backend")
})

app.listen(PORT,()=> console.log("Your server is started on PORT:",PORT))