import { stripe } from "../utils/stripeClient.js";

export const processPayment = async({transaction_id , video_id , channel_owner_id , amount})=>{
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata:  { transaction_id, video_id, channel_owner_id },
            
        })
        console.log(`Payment successful for transaction: ${transaction_id}`);
    } catch (error) {
        console.error(`Error processing payment for transaction: ${transaction_id}`, error.message);
    }
}