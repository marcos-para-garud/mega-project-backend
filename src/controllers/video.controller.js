import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
//import {asyncHandler} from "../utils/asyncHandler.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    let filter = {}

    if(query)
    {
        filter = {
            $or : [
                {title : new RegExp(query , 'i')},
                {description : new RegExp(query , 'i')}
            ]
        }
    }
       // If a userId is provided, filter by the owner of the video
       if (userId) {
        filter.owner = userId;
    }

    const videos = await Video.find(filter)
    .skip((page-1)*limit)
    .limit(Number(limit))

    const totalVideos = await Video.countDocuments(filter)

    return res.status(200).json({
        success: true,
        data: {
            videos,
            currentPage: Number(page),
            totalPages: Math.ceil(totalVideos / limit),
            totalVideos
        }
    });
})


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // Ensure all required fields are provided
    if (!(title && description && req.files)) {
        throw new apiError(400, "Title, description, video file, and thumbnail are required");
    }

    // Ensure the video file exists
    if (!req.files.videoFile || req.files.videoFile.length === 0) {
        throw new apiError(400, "Video file is required");
    }

    // Ensure the thumbnail exists
    if (!req.files.thumbNail || req.files.thumbNail.length === 0) {
        throw new apiError(400, "Thumbnail is required");
    }

    // Handle the video file upload
    const videoFilePath = req.files.videoFile[0].path;
    const uploadResponse = await uploadOnCloudinary(videoFilePath);
    if (!uploadResponse) {
        throw new apiError(500, "Failed to upload video to Cloudinary");
    }

    // Handle the thumbnail upload
    const thumbNailFilePath = req.files.thumbNail[0].path;
    const thumbNailUploadResponse = await uploadOnCloudinary(thumbNailFilePath);
    if (!thumbNailUploadResponse) {
        throw new apiError(500, "Failed to upload thumbnail to Cloudinary");
    }

    // Create the new video entry
    const newVideo = await Video.create({
        videoFile: uploadResponse.url, // Cloudinary URL for video
        thumbNail: thumbNailUploadResponse.url, // Cloudinary URL for thumbnail
        title,
        description,
        duration: req.body.duration || 0, // Assuming duration can be provided in the body
        owner: req.user.id, // Assuming user is authenticated and ID is in req.user
    });

    return res.status(201).json(new apiResponse(201, newVideo, "Video published successfully"));
});




const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId))
    {
        throw new apiError( 404 , "this video is not valid")
    }
    const video = await Video.findById(videoId).populate('owner', 'name');

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Return video details
    return res.status(200).json(new apiResponse(200, video, "Video fetched successfully"));

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!isValidObjectId(videoId))
        {
            throw new apiError( 404 , "this video is not valid")
        }
        const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    const { title , description , thumbnail } = req.body

    if(title)
    {
         video.title = title
    }
    if(description)
    {
        video.description = description
    }
    if(thumbnail)
    {
        video.thumbnail = thumbnail
    }

    await video.save()

    return res.status(200).json({
        success: true,
        message: "Video updated successfully",
        data: video,
    });
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId))
        {
            throw new apiError( 404 , "this video is not valid")
        }
        const video = await Video.findById(videoId)
    
        if (!video) {
            throw new apiError(404, "Video not found");
        }
     
        await Video.findByIdAndDelete(videoId);


        return res.status(200).json(new apiResponse(200, {}, "Video deleted successfully"));

    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId))
    {
        throw new apiError( 404 , "this video is not valid")
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new apiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;

    // Save the updated video
    await video.save();

    // Send success response
    return res.status(200).json(new apiResponse(200, video, `Video publish status updated to ${video.isPublished ? 'published' : 'unpublished'}`));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}