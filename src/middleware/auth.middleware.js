import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


const authMiddleware = asyncHandler( async( req , res , next)=>{
    try {
        const token = req.cookies.accessToken || req.headers["authorization"]

        if(!token)
        {
            throw new apiError(411 , "access denied, no token provided")
        }
        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        const user = await User.findById(req.user._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(412 , "usernot found")
        }
        req.user = user
        next();
    } catch (error) {
        throw new apiError(403, "Invalid or expired token.");
        
    }
})

export default authMiddleware