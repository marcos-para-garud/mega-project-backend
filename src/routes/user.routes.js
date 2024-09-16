import { Router } from "express"
import registerUser, { loginUser, logoutUser, updateCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { changeCurrentPassword } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { getUserChannelProfile } from "../controllers/user.controller.js";
import { getWatchHistory } from "../controllers/user.controller.js";

const router = Router()

router.post('/register', upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1 
    }
]) ,registerUser)

router.post('/login' , loginUser);

router.post('/logout' , authMiddleware , logoutUser);

router.post('/changePassword' , authMiddleware , changeCurrentPassword)

router.get('getCurrentUser' , authMiddleware , getCurrentUser)

router.put('/update-account', authMiddleware, updateAccountDetails);

router.put('/update-avatar', authMiddleware, upload.single('avatar'), updateAvatar);

router.put('/update-coverImage', authMiddleware, upload.single('coverImage'), updateCoverImage);

router.get('/channel-profile/:username', authMiddleware, getUserChannelProfile);

router.get('watch-history', authMiddleware, getWatchHistory);


export default router;