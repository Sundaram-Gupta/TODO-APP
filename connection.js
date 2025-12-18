const mongoose = require("mongoose");

async function connectDB(url){
    const conn =  await mongoose.connect(url);
    // console.log(conn);
    return conn;
}

module.exports = connectDB;