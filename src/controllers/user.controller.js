import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

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

    const avatarLocalPath = null;
    if(req.files && req.files.avatar && req.files.avatar.length>0)
    {
        avatarLocalPath = req.files.avatar[0].path;
    }

    const coverImageLocalPath = null;
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

export default registerUser;