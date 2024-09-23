import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
//import {Subscription} from "../models/subscription.model.js"
import Subscription from "../models/subscriber.model.js"

import {Like} from "../models/like.model.js"
//import {asyncHandler} from "../utils/asyncHandler.js"
import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params
    const user = await User.findById(channelId);

    if(!user){
        throw new apiError(400,"channel Not found");
    }

    const totalVideos = await Video.countDocuments({owner : channelId})

    const totalViewsResult = await Video.aggregate([
        {
            $match: {owner: mongoose.Types.ObjectId(channelId) }
        },
        {
            $group:{
                _id: null,
                viewsCount: { $sum: "$views"}
            }
        }
    ])

    let viewCount = 0;
    if (totalViewsResult.length > 0 && totalViewsResult[0].viewsCount !== undefined) {
        viewCount = totalViewsResult[0].viewsCount;
    }

    const totalLikesResult = await Video.aggregate([
        {
            $match: { owner: mongoose.Types.ObjectId(channelId) }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ]);

    let totalLikes = 0;
    if (totalLikesResult.length > 0 && totalLikesResult[0].totalLikes !== undefined) {
        totalLikes = totalLikesResult[0].totalLikes;
    }

    return res.status(200).json(new apiResponse(200, {
        totalVideos,
        viewCount,
        totalLikes
    }, "Channel stats fetched successfully"));
});
    



const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params

    const user = await User.findById(channelId);
    if (!user) {
        throw new apiError(404, "Channel not found");
    }

    const videos = await Video.find({ owner: channelId });

    if (videos.length === 0) {
        return res.status(200).json(new apiResponse(200, [], "No videos uploaded by this channel"));
    }

    // Return the list of videos
    return res.status(200).json(new apiResponse(200, videos, "Videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }