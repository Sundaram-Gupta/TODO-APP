const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    todo:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "pending"
    }
})

const TODO = mongoose.model("todos",todoSchema);
module.exports = TODO;