import amqp from "amqplib";
import { buffer, json } from "stream/consumers";

export const publishNotification = async (req , res)=>{

    const {userId , type , message} = req.body;
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        const queue = 'notificationQueue';

        await channel.assertQueue(queue , {durable:true});

        const notificationData = {userId , type , message};
        channel.sendToQueue(queue , Buffer.from(JSON.stringify(notificationData)));
        res.status(200).send(`Notification of type "${type}" sent successfully.`);
        console.log('Notification sent:', notificationData);

        await channel.close();
        await connection.close();
    } catch (error) {
        res.status(500).send('Error sending notification');
        console.error('Error:', error.message);
    }
};