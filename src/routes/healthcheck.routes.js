import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
//import {verifyJWT} from "../middlewares/auth.middleware.js"
import authMiddleware from '../middleware/auth.middleware.js';
const router = Router();

router.use(authMiddleware); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router