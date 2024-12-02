import amqp from 'amqplib'
import { handleNotification } from '../controllers/notificationController.js'

export const listenForNotifications = async()=>{
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        const queue = 'notificationQueue';

        await channel.assertQueue(queue, {durable : true});
        console.log(`Listening for notifications on ${queue}...`);

        channel.consume(queue , async (msg)=>{
            if(msg!==null)
            {
                const notificationData = JSON.parse(msg.content.toString());
                console.log('Received notification:', notificationData);

                await handleNotification(notificationData);
                channel.ack(msg);

            }
        })
    } catch (error) {
        console.error('Error in RabbitMQ listener:', error.message);
    }

}