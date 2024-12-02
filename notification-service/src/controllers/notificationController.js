import Notification from "../models/notificationModels.js";
import mongoose from "mongoose";

export const handleNotification = async (notificationData)=>{
    const { userId , type , message } = notificationData

    try {

           // List of valid types
           const validTypes = ['like', 'comment', 'subscription', 'payment'];

           // Validate the notification type
           if (!validTypes.includes(type)) {
               console.warn(`Unknown notification type: ${type}`);
               return;  // Exit early if the type is invalid
           }
   
        console.log(`Processing notification for User ${userId}: [${type}] - ${message}`);

        // TODO: Add logic to handle different types of notifications
        switch (type) {
            case 'like':
                await handleLikeNotification(userId, message);
                break;
            case 'comment':
                await handleCommentNotification(userId, message);
                break;
            case 'subscription':
                await handleSubscriptionNotification(userId, message);
                break;
            case 'payment':
                await handlePaymentNotification(userId, message);
                break;
            default:
                console.warn(`Unknown notification type: ${type}`);
        }

        // Log success message
        console.log(`Notification processed successfully for User ${userId}`);
    } catch (error) {
        // Handle errors
        console.error(`Error processing notification for User ${userId}:`, error.message);
    }
};




// Function to handle "like" notifications
const handleLikeNotification = async (userId, message) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const newNotification = new Notification({
            userId: objectId,
            type: 'like',
            message,
            read: false,
        });
        await newNotification.save();
        console.log(`Like notification saved for User ${userId}`);
    } catch (error) {
        console.error(`Error handling like notification for User ${userId}:`, error.message);
    }
};



// Function to handle "comment" notifications
const handleCommentNotification = async (userId, message) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const newNotification = new Notification({
            userId:objectId,
            type: 'comment',
            message,
            read: false,
        });
        await newNotification.save();
        console.log(`Comment notification saved for User ${userId}`);
    } catch (error) {
        console.error(`Error handling comment notification for User ${userId}:`, error.message);
    }
};




// Function to handle "subscription" notifications
const handleSubscriptionNotification = async (userId, message) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const newNotification = new Notification({
            userId:objectId,
            type: 'subscription',
            message,
            read: false,
        });
        await newNotification.save();
        console.log(`Subscription notification saved for User ${userId}`);
    } catch (error) {
        console.error(`Error handling subscription notification for User ${userId}:`, error.message);
    }
};



// Function to handle "payment" notifications
const handlePaymentNotification = async (userId, message) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const newNotification = new Notification({
            userId:objectId,
            type: 'payment',
            message,
            read: false,
        });
        await newNotification.save();
        console.log(`Payment notification saved for User ${userId}`);
    } catch (error) {
        console.error(`Error handling payment notification for User ${userId}:`, error.message);
    }
};