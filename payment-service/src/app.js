import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { listenForPayments } from './utils/rabbitmq.js'


dotenv.config()

const app = express();

const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(bodyParser.json());

listenForPayments();
app.get("/" , (req , res)=>{
    res.send("payment service is running ");
})

app.listen(PORT ,'0.0.0.0', ()=>{
    console.log(`payment service on port ${PORT} and ci/cd working-1`);
    
})