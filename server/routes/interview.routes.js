import express from 'express';
import {
  generateQuestions,
  getQuestions,
  deleteQuestions,
  getStats,
  emailQuestionsToCandidate,
  getCandidateQuestions
} from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();



router.post('/generate/:applicationId', protect, authorizeRoles('employer'), generateQuestions);
router.get('/stats', protect, authorizeRoles('employer'), getStats);
router.get('/:applicationId', protect, authorizeRoles('employer'), getQuestions);
router.delete('/:applicationId', protect, authorizeRoles('employer'), deleteQuestions);
router.post('/:applicationId/email', protect, authorizeRoles('employer'), emailQuestionsToCandidate);
router.get('/candidate/:applicationId', protect, authorizeRoles('candidate'), getCandidateQuestions);

export default router;
