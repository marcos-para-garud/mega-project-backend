import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import apiError from "../utils/apiError.js"
//const { ObjectId } = require('mongodb');
//import ObjectId from "mongodb"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import apiResponse from "../utils/apiResponse.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import { Like } from "../models/like.model.js"



const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
        return next(apiError.badRequest("Invalid video ID"));
    }

    // Aggregate comments for the specified video
    const aggregate = Comment.aggregate([
        {
            $match: {
                video:new mongoose.Types.ObjectId(videoId) // Match comments for the specific video
            }
        },
        {
            $lookup: {
                from: "users", // Assuming "users" is the collection name for User model
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
       
        {
            $project: {
                content: 1,
                createdAt: 1,
                "ownerDetails.name": 1, // Include the owner's name
                "ownerDetails.avatar": 1 // Include the owner's avatar if available
            }
        }
    ]);

    // Paginate the results
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const comments = await Comment.aggregatePaginate(aggregate, options);

    
    return res
        .status(200)
        .json(new apiResponse(200, comments, "Comments fetched successfully"));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    
    if(!content)
    {
        throw new apiError(404 , "No comments added")
    }

    const video = await Video.findById(videoId)
    if(!video)
    {
        throw new apiError(404 , "video not found")
    }
    const createComment = await Comment.create({
        content ,
        video : videoId ,
        owner : req.user?._id 
    })

    if (!createComment) {
        throw new apiError(500, "Failed to add comment please try again");
    }

    return res
    .status(201)
    .json(new apiResponse(201, createComment, "Comment added successfully"));

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(!content)
    {
        throw new apiError(404 , "updated comment not added")
    }
    const _comment = await Comment.findById(commentId);

    if(!_comment){
        throw new apiError(400,"comment not found");
    }

    _comment.content = content
    
    const updatedComment = await _comment.save();

    // Return the updated comment with a custom ApiResponse
    return res.status(200).json(
        new apiResponse(200, updatedComment, "Comment edited successfully")
    );

})



const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming req.user contains the authenticated user's data

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Check if the comment exists
    if (!comment) {
        throw new apiError(404, "Comment not found for deleting");
    }

    // Check if the comment belongs to the authenticated user
    if (comment.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to delete this comment");
    }

    // Delete the comment
    await comment.deleteOne();

    // Return a success response
    return res.status(200).json(
        new apiResponse(200, null, "Comment deleted successfully")
    );
});


export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }