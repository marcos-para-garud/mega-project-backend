import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"

import authMiddleware from '../middleware/auth.middleware.js';
const router = Router();
router.use(authMiddleware); // Apply verifyJWT middleware to all routes in this file


router.route("/c/:channelId").get(getUserChannelSubscribers);

router.route("/c/:channelId").post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router