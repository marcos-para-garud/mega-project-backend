import express from "express";
import { sendPaymentRequest } from "../utils/rabbitmq.js";

const router = express.Router()

router.post('/payments', async(req , res)=>{
    const { video_id, channel_owner_id, amount } = req.body;
    const transaction_id = `txn_${Date.now()}`;


    const paymentData = {
        transaction_id,
        video_id,
        channel_owner_id,
        amount,
    };


    try {
        await sendPaymentRequest(paymentData);
        res.status(202).json({ message: 'Payment request sent', transaction_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment request' });
    }
})


export default router;