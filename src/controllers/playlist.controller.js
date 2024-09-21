import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const {userId} = req.user._id
    if(!name || !description)
    {
        throw new apiError(404 , "name and description are required")
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner : userId,
        videos: []
    })

    return res.status(201).json(
        new apiResponse(201, newPlaylist, "Playlist created successfully")
    );

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"invalid user id");
    }

    const userPlaylists = await Playlist.aggregate([
        {
            $match : { 
                owner :  new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from :"videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields : {
                totalVideos : { $size : "videos" },
                totalViews: { $sum : "$videos.views"}
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ])
    return res.status(200).json(new apiResponse(200, userPlaylists, "User playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: { 
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos", // Assuming the collection name is 'videos'
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalViews: { $sum: "$videos.views" }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: 1,
                updatedAt: 1
            }
        }
    ])
    if (!playlist.length) {
        throw new apiError(404, "Playlist not found");
    }

    return res.status(200).json(new apiResponse(200, playlist[0], "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    {
        throw new apiError(404 , "invalid playlist or videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new apiError(404 , "Playlist does not exist")
    }

     // Check if the video is already in the playlist
     if (playlist.videos.includes(videoId)) {
        throw new apiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId)

    await playlist.save()

    return res.status(200).json(new apiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId))
        {
            throw new apiError(404 , "invalid playlist or videoId")
        }
    
        const playlist = await Playlist.findById(playlistId)
    
        if(!playlist)
        {
            throw new apiError(404 , "Playlist does not exist")
        }
          // Check if the video is already in the playlist
     if (!playlist.videos.includes(videoId)) {
        throw new apiError(400, "Video already does not exists in the playlist");
    }

    await playlist.videos.pull(videoId)

    await playlist.save()

    return res.status(200).json(new apiResponse(200, playlist, "Video removed to playlist successfully"));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId))
    {
        throw new apiError(404 , "invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new apiError( 404 , "playlist does not exist")
    }

    const userId = req.user._id

    if(playlist.owner.toString() !== userId.toString())
    {
        throw new apiError(403, "You are not authorized to delete this playlist");
    }

    await playlist.remove()

    return res.status(200).json(new apiResponse(200, null, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId))
    {
        throw new apiError(404 , "invalid playlist")
    }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new apiError( 404 , "playlist does not exist")
    }

    const userId = req.user._id

    if(playlist.owner.toString() !== userId.toString())
    {
        throw new apiError(403, "You are not authorized to update this playlist");
    }

    if(name) playlist.name = name
    if(description) playlist.description = description

    const updatedPlaylist = await playlist.save()

    return res.status(200).json(new apiResponse(200, updatedPlaylist, "Playlist updated successfully"));


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}