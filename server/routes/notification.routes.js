import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markAsRead);

export default router;
