import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"

import authMiddleware from '../middleware/auth.middleware.js';
const router = Router();



router.route('/stats/:channelId').get(authMiddleware , getChannelStats)

router.route('/video/:channelId').get(getChannelVideos);

export default router;