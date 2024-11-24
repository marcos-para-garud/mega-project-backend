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


app.listen(PORT , ()=>{
    console.log(`payment service on port ${PORT} and ci/cd working`);
    
})