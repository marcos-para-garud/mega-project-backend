import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
//import { Subscription } from "../models/subscription.model.js"
//import { Subscription } from "../models/subscriber.model.js"
import Subscription from "../models/subscriber.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
//import {asyncHandler} from "../utils/asyncHandler.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId))
    {
        throw new apiError(404 , "the channel does not exist")
    }

    

    const channel = await User.findById( channelId )
    const  userId  = req.user._id; 

    if(!channel)
    {
        throw new apiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne(
        {
            channel : channelId,
            subscriber : userId
        }
    )

    if(existingSubscription)
    {
        await existingSubscription.remove(); 
        return res.status(200).json(new apiResponse(200, null, "Unsubscribed successfully"));
    }
    
    else{
        const newSubscription = await Subscription.create({
            channel : channelId,
            subscriber : userId
        })
    
    
    return res.status(201).json(new apiResponse(201, newSubscription, "Subscribed successfully"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId))
    {
        throw new apiError(404 , "channel does not exist")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new apiError(404, "Channel not found");
    }

    const subscribers = await Subscription.find({ channel: channelId })
    .populate('subscriber', 'name email') 

    if (!subscribers.length) {
        throw new apiError(404, "No subscribers found for this channel");
    }

    // Return the list of subscribers
    return res.status(200).json(new apiResponse(200, subscribers, "Subscribers fetched successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId))
    {
        throw new apiError(404 , "subscriber does not exist")
    }
    const subscriber = await User.findById(subscriberId)
    if (!subscriber) {
        throw new apiError(404, "Subscriber not found");
    }
    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
    .populate('channel', 'name email') 

    if (!subscribedChannels.length) {
        throw new apiError(404, "No subscribed channels found for this user");
    }

    // Return the list of subscribed channels
    return res.status(200).json(new apiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}