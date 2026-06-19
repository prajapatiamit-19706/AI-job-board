import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware.js';
import {
    getMyProfile,
    getPublicProfile,
    updateProfile,
    uploadAvatar,
} from '../controllers/profile.controller.js';

const router = express.Router();

// multer — memory storage, 2MB limit, images only
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files allowed'));
    },
});

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/:userId', protect, getPublicProfile);  // employer views candidate

export default router;