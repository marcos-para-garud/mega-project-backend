import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId = req.user._id

    if(!content)
    {
        throw new apiError(404 , "enter tweet content")
    }

    const tweet = await Tweet.create({
        content,
        owner : userId
    })

    return res.status(201).json(
        new apiResponse(201, tweet, "Tweet created successfully")
    );

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user)
    {
        throw new apiError(404 , "tweet user cannot found")
    }

    const tweets = await Tweet.find({owner : userId})


    if (!tweets.length) {
        throw new apiError(404, "No tweets found for this user");
    }

    // Return the user's tweets with a custom ApiResponse
    return res.status(200).json(
        new apiResponse(200, tweets, "Tweets found successfully")
    );

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    const userId = req.user._id

    if(!content)
    {
        throw new apiError(404, "No content");
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
    {
        throw new apiError(404, "Tweet does not exist");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to update this tweet");
    }

     // Update the tweet content
     tweet.content = content;
     const updatedTweet = await tweet.save();
 
     // Send the updated tweet as a response
     return res.status(200).json(
         new apiResponse(200, updatedTweet, "Tweet updated successfully")
     );

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    const userId = req.user._id

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
    {
        throw new apiError(404 , "tweet does not exist")
    }

    if(tweet.owner.toString() !== userId.toString())
    {
        throw new apiError(404 , "only owner if this tweet can delete this")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new apiResponse(200, null, "Tweet deleted successfully")
    );
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}