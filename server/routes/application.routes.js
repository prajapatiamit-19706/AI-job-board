import express from 'express';
import {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorizeRoles('candidate'), uploadResume, applyToJob);
router.get('/my', protect, authorizeRoles('candidate'), getCandidateApplications);
router.get('/job/:jobId', protect, authorizeRoles('employer'), getJobApplications);
router.patch('/:id/status', protect, authorizeRoles('employer'), updateApplicationStatus);
router.delete('/:id', protect, authorizeRoles('candidate'), withdrawApplication);

export default router;
