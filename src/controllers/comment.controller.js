import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import apiError from "../utils/apiError.js"

import {asyncHandler} from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import apiResponse from "../utils/apiResponse.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // Extract videoId from the request parameters and pagination info (page, limit) from query
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;

    // Find the video by its ID to make sure it exists
    const video = await Video.findById(videoId);
    if (!video) {
        // If the video doesn't exist, throw a 404 error
        throw new apiError(404, "Video does not exist");
    }

    // Build the aggregation pipeline for fetching comments related to the video
    const commentAggregate = await Comment.aggregate([
        {
            // Match comments that are associated with the given videoId
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            // Lookup the 'owner' field (the user who posted the comment) by referencing the 'User' collection
            $lookup: {
                from: "User",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            // Lookup the 'Like' collection to fetch likes associated with each comment
            $lookup: {
                from: "Like",
                localField: "_id",
                foreignField: "comment",
                as: "like"
            }
        },
        {
            // Add additional fields to the results:
            $addFields: {
                // Count the number of likes for each comment
                likeCount: {
                    $size: "$like"
                },
                // Take the first user from the 'owner' lookup result (since it's an array)
                owner: {
                    $first: "$owner"
                },
                // Check if the current user has liked the comment or not
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$like.likeBy"] }, // Check if the user ID is in the array of people who liked the comment
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // Sort comments by creation date in descending order (most recent first)
            $sort: {
                createdAt: -1
            }
        },
        {
            // Project specific fields to be returned in the response
            $project: {
                content: 1,            // Include the comment content
                createdAt: 1,          // Include the creation date of the comment
                likeCount: 1,          // Include the count of likes for each comment
                owner: {               // Include owner details (username, fullName, avatar URL)
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1
                },
                isLiked: 1             // Include whether the comment is liked by the current user
            }
        }
    ]);

    // Pagination options (page number and limit per page)
    const option = {
        page: parseInt(page, 10),     // Parse the 'page' from query as an integer
        limit: parseInt(limit, 10)    // Parse the 'limit' from query as an integer
    };

    // Use the aggregatePaginate method to apply pagination on the aggregation result
    const comments = await Comment.aggregatePaginate(commentAggregate, option);

    // Return the paginated comments in the response with a success message
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

// const deleteComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
//     const {commentId} = req.params
//     const _comment = await Comment.findById(commentId)

//     if(!_comment)
//     {
//         throw new apiError(404 , "comment not found for deleting")
//     }

//     await _comment.remove();

//     return res.status(200).json(
//         new apiResponse(200, null, "Comment deleted successfully")
//     );

// })

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
    await comment.remove();

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