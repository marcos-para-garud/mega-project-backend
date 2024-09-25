import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user._id

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "video not found");
    }

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : userId
    })

    if(existingLike)
    {
        await existingLike.remove();
        return res.status(200).json(
            new apiResponse(200, null, "Like removed successfully")
        );
    }

    const newLike = await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res.status(201).json(
        new apiResponse(201, newLike, "Like added successfully")
    );
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : userId
    })

    if(existingLike)
    {
        await existingLike.remove();
        return res.status(200).json(new apiResponse(200, null, "Comment like removed successfully")); 
    }

    const newLike = await Like.create({
        comment: commentId,
        likedBy: userId
    })
    return res.status(200).json(
        new apiResponse(200, newLike, "Comment liked successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new apiError(404, "tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if(existingLike)
    {
        await existingLike.remove()
        return res.status(200).json(new apiResponse(200, null, "tweet like removed successfully")); 
    }

    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res.status(200).json(
        new apiResponse(200, newLike, "tweet liked successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    console.log("User ID:", userId);

    const likedVideos = await Like.find({ likedBy: userId , video: {$exists : true}}).populate('video')

    if (!likedVideos.length) {
        throw new apiError(404, "No liked videos found for this user");
    }
    return res.status(200).json(new apiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}