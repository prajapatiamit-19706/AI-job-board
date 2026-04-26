import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  closeJob,
  deleteJob,
  getEmployerJobs,
} from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/employer/my', protect, authorizeRoles('employer'), getEmployerJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorizeRoles('employer'), createJob);
router.put('/:id', protect, authorizeRoles('employer'), updateJob);
router.patch('/:id/close', protect, authorizeRoles('employer'), closeJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);

export default router;
