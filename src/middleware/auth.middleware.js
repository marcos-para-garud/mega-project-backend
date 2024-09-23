// import { User } from "../models/user.model.js";
// import apiError from "../utils/apiError.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"


// const authMiddleware = asyncHandler( async( req , res , next)=>{
//     try {
//         const token = req.cookies.accessToken || req.headers["authorization"]

//         if(!token)
//         {
//             throw new apiError(411 , "access denied, no token provided")
//         }
//         const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        
//         const user = await User.findById(decoded._id).select("-password -refreshToken")
//         if(!user){
//             throw new apiError(412 , "usernot found")
//         }
//         req.user = user
//         next();
//     } catch (error) {
//         throw new apiError(403, "Invalid or expired token.");
        
//     }
// })

// export default authMiddleware



import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        // Check for token in cookies or headers
        const token = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            throw new apiError(401, "Access denied, no token provided");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Find the user without returning the password or refresh token
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        
        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Set the user in the request
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        throw new apiError(403, "Invalid or expired token.");
    }
});

export default authMiddleware;
