import express from 'express';
import {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/application.controller.js';
import { protect as authenticateUser } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/:jobId', authenticateUser, authorizeRoles('candidate'), uploadResume, applyToJob);
router.get('/my', authenticateUser, authorizeRoles('candidate'), getCandidateApplications);
router.get('/job/:jobId', authenticateUser, authorizeRoles('employer'), getJobApplications);
router.patch('/:id/status', authenticateUser, authorizeRoles('employer'), updateApplicationStatus);
router.delete('/:id', authenticateUser, authorizeRoles('candidate'), withdrawApplication);

export default router;
