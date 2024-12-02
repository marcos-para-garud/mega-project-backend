import express from 'express';
import { publishNotification } from '../controllers/notificationController.js';

const router = express.Router();

// Define the route for publishing notifications
router.post('/publish', publishNotification);

export default router;
