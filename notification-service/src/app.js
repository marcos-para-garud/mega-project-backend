import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { listenForNotifications } from "./utils/rabbitmq.js";
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection failed:', error.message));

listenForNotifications();


app.use('/api', notificationRoutes);

app.get("/" , (req , res)=>{
    res.send("Notification service is running ");
})

const PORT = process.env.PORT || 5002;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Notification service running on port ${PORT}`);
});