import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import { extractTextFromPDF } from './pdfExtract.js';
import { scoreResume } from './aiScorer.js';
import { getIO } from '../config/socket.js';
import { createNotification } from './notify.js';
export const triggerAIScoring = async (applicationId, resumeUrl, job) => {
  try {
    console.log('=== AI SCORING STARTED ===')
    console.log('Application ID:', applicationId)
    console.log('Resume URL:', resumeUrl)
    console.log('Job Title:', job?.title)

    const resumeText = await extractTextFromPDF(resumeUrl)
    console.log('Extracted text length:', resumeText?.length ?? 'FAILED - PDF extraction returned null')

    if (!resumeText) {
      console.log('❌ PDF extraction failed — stopping here')
      return
    }

    const result = await scoreResume(resumeText, job.title, job.description, job.skills)
    console.log('Groq result:', result)

    if (!result) {
      console.log('❌ Groq scoring failed — stopping here')
      return
    }

    await Application.findByIdAndUpdate(applicationId, {
      aiScore: result.score,
      aiSummary: result.summary,
      aiSkillsMatched: result.skillsMatched,
      aiSkillsMissing: result.skillsMissing,
      aiExperienceMatch: result.experienceMatch,
      aiRecommendation: result.recommendation,
      aiScoredAt: new Date()
    })

    console.log('✅ DB updated with AI score')

    const io = getIO()
    if (io) {
      io.emit('aiScoreReady', {
        applicationId,
        score: result.score,
        summary: result.summary,
        skillsMatched: result.skillsMatched,
        skillsMissing: result.skillsMissing,
        experienceMatch: result.experienceMatch,
        recommendation: result.recommendation
      })
      console.log('✅ Socket event emitted')
    } else {
      console.log('❌ io is null — socket not initialized')
    }

    const app = await Application.findById(applicationId).select('candidate');
    if (app && app.candidate) {
      createNotification(
        app.candidate,
        'ai_scored',
        'AI Resume Analysis Complete',
        `Your resume scored ${result.score}/100 for the ${job.title} position`,
        { jobId: job._id, applicationId }
      );
    }

  } catch (err) {
    console.error('❌ triggerAIScoring error:', err.message)
  }
}