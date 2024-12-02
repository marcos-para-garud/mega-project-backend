import amqp from 'amqplib'
import { processPayment } from '../controller/paymentController.js'

export const listenForPayments = async()=>{
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://host.docker.internal:5673');
        const channel =await connection.createChannel();
        const queue = 'paymentQueue';

        await channel.assertQueue(queue, {durable:true});

        console.log(`Listening for messages in ${queue}...`);

        channel.consume(queue, async(msg)=>{
            if(msg!=null)
            {
                const paymentData = JSON.parse(msg.content.toString());
                console.log('Received payment message:', paymentData);

                await processPayment(paymentData);

                channel.ack(msg);
            }
        })
    } catch (error) {
        console.error('Error listening for RabbitMQ messages:', error.message);
    }
}