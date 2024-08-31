import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
import app from "./app.js";


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log("Server is running at 8000");
        
    })
})
.catch(error=>{
    console.log("mongoose connection error");
    
})