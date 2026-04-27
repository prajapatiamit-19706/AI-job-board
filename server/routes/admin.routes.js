import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import {
  getStats,
  getApplicationsPerDay,
  getAllUsers,
  getAllJobs,
  toggleUserStatus
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/applications-chart', getApplicationsPerDay);
router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.patch('/users/:id/toggle', toggleUserStatus);

export default router;
