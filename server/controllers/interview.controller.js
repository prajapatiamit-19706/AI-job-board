import Application from '../models/Application.model.js';
import InterviewQuestion from '../models/InterviewQuestion.model.js';
import { generateInterviewQuestions } from '../utils/interviewGenerator.js';
import { sendInterviewEmail } from '../utils/email.js';

export const generateQuestions = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You don't own this job" });
    }

    if (application.aiScore === null || application.aiScore === undefined) {
      return res.status(400).json({ success: false, message: 'AI scoring not complete yet. Please wait.' });
    }

    const existing = await InterviewQuestion.findOne({ applicationId });
    if (existing) {
      await InterviewQuestion.deleteOne({ _id: existing._id });
    }

    const generatedQuestions = await generateInterviewQuestions(application.job, application);
    if (!generatedQuestions) {
      return res.status(500).json({ success: false, message: 'Failed to generate questions' });
    }

    const interviewQuestion = await InterviewQuestion.create({
      jobId: application.job._id,
      applicationId,
      employerId: req.user._id,
      candidateId: application.candidate,
      questions: generatedQuestions,
      aiScore: application.aiScore,
      generatedAt: new Date(),
      regeneratedCount: existing ? existing.regeneratedCount + 1 : 0
    });

    return res.status(200).json({ success: true, data: interviewQuestion });
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const interviewQuestion = await InterviewQuestion.findOne({ applicationId });
    if (!interviewQuestion) {
      return res.status(200).json({ success: true, data: null });
    }

    if (interviewQuestion.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    return res.status(200).json({ success: true, data: interviewQuestion });
  } catch (error) {
    console.error('Error in getQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteQuestions = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const interviewQuestion = await InterviewQuestion.findOne({ applicationId });
    if (!interviewQuestion) {
      return res.status(404).json({ success: false, message: 'Questions not found' });
    }

    if (interviewQuestion.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await InterviewQuestion.deleteOne({ _id: interviewQuestion._id });

    return res.status(200).json({ success: true, message: 'Questions deleted' });
  } catch (error) {
    console.error('Error in deleteQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const questions = await InterviewQuestion.find({ employerId: req.user._id });

    const totalGenerated = questions.length;
    let totalScore = 0;
    const categoryBreakdown = {
      technical: 0,
      behavioral: 0,
      'gap-based': 0
    };

    questions.forEach(qSet => {
      if (qSet.aiScore) {
        totalScore += qSet.aiScore;
      }
      qSet.questions.forEach(q => {
        if (categoryBreakdown[q.category] !== undefined) {
          categoryBreakdown[q.category]++;
        }
      });
    });

    const avgCandidateScore = totalGenerated > 0 ? (totalScore / totalGenerated).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalGenerated,
        avgCandidateScore: parseFloat(avgCandidateScore),
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const emailQuestionsToCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const interviewQuestion = await InterviewQuestion.findOne({ applicationId });
    if (!interviewQuestion) {
      return res.status(404).json({ success: false, message: 'Generate questions first' });
    }

    if (interviewQuestion.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const application = await Application.findById(applicationId).populate('candidate job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const groupedQuestions = {
      technical: interviewQuestion.questions.filter(q => q.category === 'technical'),
      behavioral: interviewQuestion.questions.filter(q => q.category === 'behavioral'),
      'gap-based': interviewQuestion.questions.filter(q => q.category === 'gap-based')
    };

    sendInterviewEmail(application.candidate, application.job.title, groupedQuestions, application.aiScore);

    return res.status(200).json({ success: true, message: "Questions sent to candidate's email" });
  } catch (error) {
    console.error('Error in emailQuestionsToCandidate:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

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
