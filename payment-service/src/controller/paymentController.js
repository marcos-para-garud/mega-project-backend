// import { stripe } from "../utils/stripeClient.js";

// export const processPayment = async({transaction_id , video_id , channel_owner_id , amount})=>{
//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'usd',
//             metadata:  { transaction_id, video_id, channel_owner_id },
            
//         })
//         console.log(`Payment successful for transaction: ${transaction_id}`);
//     } catch (error) {
//         console.error(`Error processing payment for transaction: ${transaction_id}`, error.message);
//     }
// }



import { stripe } from "../utils/stripeClient.js";
import amqp from "amqplib"; // Import for RabbitMQ connection

// Function to process payment and send notification
export const processPayment = async ({ transaction_id, video_id, channel_owner_id, amount }) => {
  try {
    // Create the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,  // Amount in cents
      currency: 'usd',
      metadata: { transaction_id, video_id, channel_owner_id },
    });
    
    console.log(`Payment successful for transaction: ${transaction_id}`);

    // If payment is successful, send a notification
    const notificationData = {
      userId: channel_owner_id,  // The channel owner who should be notified
      type: 'payment',
      message: `You have received a payment of $${amount / 100} for your video!`,
    };

    // Publish notification to RabbitMQ
    await publishNotification(notificationData);

  } catch (error) {
    console.error(`Error processing payment for transaction: ${transaction_id}`, error.message);
  }
};

// Function to publish a notification to RabbitMQ
const publishNotification = async (notificationData) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://host.docker.internal:5673');
    const channel = await connection.createChannel();
    const queue = 'notificationQueue'; // This is where your notification microservice listens

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });

    // Send the notification data to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(notificationData)));
    console.log('Notification sent to RabbitMQ:', notificationData);

    // Close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing notification:', error.message);
  }
};
