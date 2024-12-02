import amqp from 'amqplib'

export const sendPaymentRequest = async(paymentData)=>{
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        const queue = 'paymentQueue';

        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue , Buffer.from(JSON.stringify(paymentData)), { persistent: true })
        console.log('Payment request sent:', paymentData);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending payment request:', error.message);
    }
    }
