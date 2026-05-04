import Application from '../models/Application.model.js';
import InterviewQuestion from '../models/InterviewQuestion.model.js';
import { triggerInterviewGeneration } from '../utils/interviewGenerator.js';

export const getCandidateQuestions = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const interviewQuestion = await InterviewQuestion.findOne({ applicationId });
    if (!interviewQuestion) {
      return res.status(200).json({ success: true, data: null });
    }

    const strippedQuestions = interviewQuestion.questions.map(q => ({
      _id: q._id,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      purpose: q.purpose
    }));

    return res.status(200).json({ 
      success: true, 
      data: {
        questions: strippedQuestions,
        jobTitle: application.job.title,
        aiScore: interviewQuestion.aiScore,
        generatedAt: interviewQuestion.generatedAt
      } 
    });
  } catch (error) {
    console.error('Error in getCandidateQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const generateCandidateQuestions = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (!application.aiScore) {
      return res.status(400).json({ success: false, message: 'Wait for AI to score your resume before generating interview questions' });
    }

    // trigger generation asynchronously (fire and forget)
    triggerInterviewGeneration(applicationId, application.job);

    return res.status(200).json({ success: true, message: 'Generation started! Questions will appear shortly.' });
  } catch (error) {
    console.error('Error in generateCandidateQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
