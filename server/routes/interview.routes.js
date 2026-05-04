import express from 'express';
import { getCandidateQuestions, generateCandidateQuestions } from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/candidate/:applicationId', protect, authorizeRoles('candidate'), getCandidateQuestions);
router.post('/candidate/:applicationId/generate', protect, authorizeRoles('candidate'), generateCandidateQuestions);

export default router;
