import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import validator from "validator";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";

const registerUser = asyncHandler( async (req , res)=>{
    

    const {username , email, fullname , password } = req.body;
    console.log("email : "+ email);
    
    // validation

    if(!validator.isEmail(email))
    {
        throw new apiError(401 , "Invalid Email")
    }

    if(!username || !email || !fullname || !password){
        throw new apiError( 400 , "All fields are mandatory")
    }

    // checking if user already exist

    const userExist = await User.findOne({
        $or : [{ username }, { email }]
    })
    if(userExist){
        throw new apiError( 403 , "User already exist")
    }

    //path for avatar and coverImage

    // const avatarLocalPath = req.files?.avatar[0]?.path;

    let avatarLocalPath = null;
    if(req.files && req.files.avatar && req.files.avatar.length>0)
    {
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath = null;
    if(req.files && req.files.coverImage && req.files.coverImage.length>0)
    {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // checking avatar exists

    if(!avatarLocalPath){
        throw new apiError(404 , "Avatar field is mandatory")
    }

    //uploading on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)
    {
        throw new apiError(404 , "Avatar field is mandatory")
    }

    // creating database

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation
    if(!createdUser){
        throw new apiError(405 , "user is not created")
    }

    return res.status(201).json(
        new apiResponse(201 , createdUser , "User registered successfully")
    )
    
})

export const loginUser = asyncHandler( async(req , res)=>{

    //get credentials for login
    //verify the username or email is there in database or not
    //verify password
    //login successful message or incorrect credentials message
    //return response and token
    //send cookies
    
    const { username , email , password } = req.body;

    if(!(username || email))
    {
        throw new apiError(406 , "All credentials are mandatory")
    }

    const user = await User.findOne({
        $or: [{username} , {email}]
    })

    if(!user){
        throw new apiError(407 , "User does not exist, Kindly Register")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(408 , "Invalid password")
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    // return {accessToken , refreshToken}

    const options = {
        httpOnly: true,
        secure: true
    }
    res.cookie("accessToken" , accessToken , options);
    res.cookie("refreshToken" , refreshToken , options);
    return res.status(200).json({
        success: true,
        message: "Login Successful",
        accessToken,
        user:{
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname
        }
    })
    // return res.cookie("accessToken" , accessToken, options)
    // .cookie("refreshToken" , refreshToken, options)
    // .json({
    //     success: true,
    //     message: "Login successful",
    //     accessToken,
    //     user: {
    //         _id: user._id,
    //         username: user.username,
    //         email: user.email,
    //         fullname: user.fullname,
    //     }
    // });

})

// logging out

export const logoutUser = asyncHandler( async(req , res)=>{
    const { refreshToken } = req.cookies;

    if(!refreshToken)
    {
        throw new apiError(409 , "Already Logged out")
    }

    const user = await User.findOne( {refreshToken} )

    if (!user) {
        throw new apiError(404, "User not found");
    }

    user.refreshToken = null

    await user.save();


    res.clearCookie("refreshToken" , {
        httpOnly: true,
        secure: true
    })
    res.clearCookie("accessToken" , {
        httpOnly: true,
        secure: true
    })

    return res.status(202).json({
        success: true,
         message: "Logged out successfully"
    })

})

//change password

export const changeCurrentPassword = asyncHandler( async (req , res)=>{
    const {oldPassword , newPassword} = req.body
    const user = await User.findById(req.user._id)
    if(!user)
    {
        throw new apiError(405 , "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid)
    {
        throw new apiError(406 , "invalid password")
    }
    user.password = newPassword
    await user.save()

    return res.status(201).json({
        success: true,
        message: "Password changed successfully"
    })
    
})

// current user

export const getCurrentUser = asyncHandler( async (req , res)=>{
    return res.status(201).json({
        success: true,
        user : req.user,
        message:"this is the current user"
})
})


//update account details

export const updateAccountDetails = asyncHandler( async (req , res)=>{

    const {fullname , email} = req.body
    const user = await User.findById(req.user._id)

    if(!user)
    {
        throw new apiError(407 , "user not found")
    }
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Account details updated successfully",
        user: {
            fullname: user.fullname,
            email: user.email
        }
    });

})


// update avatar

export const updateAvatar = asyncHandler(async (req , res)=>{
    const user = await User.findById(req.user._id)

    if(!user)
    {
        throw new apiError( 406 , "User not found")
    }

    if(!req.file)
    {
        throw new apiError(400, "Avatar file is required");
    }

    const result = await uploadOnCloudinary(req.file.path)
    user.avatar = result.url
    user.save()

    return res.status(201).json({
        success: true,
        message: "Avatar updated successfully",
        avatar: user.avatar,
    })
})


// update cover image


export const updateCoverImage = asyncHandler(async (req , res)=>{
    const user = await User.findById(req.user._id)

    if(!user)
    {
        throw new apiError( 406 , "User not found")
    }

    if(!req.file)
    {
        throw new apiError(400, "Cover Image file is required");
    }

    const result = await uploadOnCloudinary(req.file.path)
    user.coverImage = result.url
    user.save()

    return res.status(201).json({
        success: true,
        message: "cover image updated successfully",
        avatar: user.coverImage,
    })
})


//get user channel profile

export const getUserChannelProfile = asyncHandler( async (req , res)=>{
    const {username} = req.params

    if(!username)
    {
        throw new apiError(404 , "Username is required")
    }

    const channel = User.aggregate([
        {
            $match: { username },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { 
                            $in: [req.user._id, "$subscribers.subscriber"] 
                        },
                        then: true,
                        else: false,
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }

    ])

    if(!channel || channel.length===0)
    {
        throw new apiError(405 , "User not found")
    }

    return res.status(201).json({
        success: true,
        channel : channel[0],
        message: "User channel profile fetched successfully",
    })

})



// get watch history


export const getWatchHistory = asyncHandler( async (req , res)=>{

    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline:[
                    {
                    $lookup:{
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                            $project:{
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                            }
                        }
                        ]
                    }
                }
                ]           

            }
        }
    ])
    return res.status(200).json({
        success: true,
        data: user[0],
        message: "Watch history fetched successfully"
    });
})


export default registerUser;
