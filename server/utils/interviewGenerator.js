import Groq from 'groq-sdk';
import Application from '../models/Application.model.js';
import InterviewQuestion from '../models/InterviewQuestion.model.js';
import { getIO } from '../config/socket.js';
import { createNotification } from './notify.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateInterviewQuestions = async (job, application) => {
  try {
    const aiSkillsMatched = application.aiSkillsMatched?.length > 0 ? application.aiSkillsMatched.join(', ') : "Not specified";
    const aiSkillsMissing = application.aiSkillsMissing?.length > 0 ? application.aiSkillsMissing.join(', ') : "None identified";
    const requiredSkills = job.skills?.length > 0 ? job.skills.join(', ') : "None specified";

    const systemPrompt = `You are an expert technical interviewer with 15 years of experience.
Your job is to generate highly targeted interview questions based on a specific job role and a candidate's resume analysis.
Always respond with valid JSON only. No explanation, no markdown, no code blocks. Raw JSON only.`;

    const userPrompt = `Generate exactly 10 interview questions for this candidate.

Return a JSON array of exactly 10 objects, each with:
{
  "question": "<the interview question>",
  "category": "<technical|behavioral|gap-based>",
  "difficulty": "<easy|medium|hard>",
  "purpose": "<one sentence: why ask this>",
  "hint": "<what a strong answer looks like>"
}

Distribution rules (follow strictly):
- 4 technical questions: based on job required skills and candidate's matched skills
- 3 behavioral questions: based on the role level and responsibilities
- 3 gap-based questions: specifically targeting candidate's MISSING skills

Difficulty distribution:
- 2 easy, 5 medium, 3 hard

JOB TITLE: ${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS: ${requiredSkills}

CANDIDATE AI MATCH SCORE: ${application.aiScore}/100

CANDIDATE'S MATCHED SKILLS (they know these):
${aiSkillsMatched}

CANDIDATE'S MISSING SKILLS (they lack these — ask gap questions about these):
${aiSkillsMissing}

AI EXPERIENCE MATCH: ${application.aiExperienceMatch || 'N/A'}
AI RECOMMENDATION: ${application.aiRecommendation || 'N/A'}

Make questions specific to this exact role and candidate profile.
Gap-based questions should probe how the candidate would handle or learn the skills they are missing.
Technical questions should match the difficulty to the AI score:
- Score 80+: mostly hard technical questions
- Score 50-79: mix of medium and hard
- Score below 50: mostly easy and medium`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 2000
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) return null;

    const cleaned = text.replace(/```json|```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse JSON from Groq:', parseError);
      return null;
    }

    if (!Array.isArray(parsed)) return null;

    const validCategories = ['technical', 'behavioral', 'gap-based'];
    const validDifficulties = ['easy', 'medium', 'hard'];

    const validQuestions = parsed.filter(q => {
      return (
        q &&
        typeof q.question === 'string' &&
        validCategories.includes(q.category) &&
        validDifficulties.includes(q.difficulty)
      );
    });

    if (validQuestions.length < 5) return null;

    console.log(`Generated ${validQuestions.length} valid questions for job:`, job.title);

    return validQuestions;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return null;
  }
};

export const triggerInterviewGeneration = async (applicationId, job) => {
  try {
    const application = await Application.findById(applicationId)
      .populate('candidate', 'name email');

    if (!application?.aiScore) {
      console.log('No AI score yet — skipping interview generation');
      return;
    }

    const questions = await generateInterviewQuestions(job, application);
    if (!questions) return;

    await InterviewQuestion.findOneAndUpdate(
      { applicationId },
      {
        jobId: job._id,
        applicationId,
        employerId: job.employer, // Include employerId as per schema
        candidateId: application.candidate._id,
        questions,
        aiScore: application.aiScore,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // notify candidate via socket
    const io = getIO();
    if (io) {
      io.emit('interviewQuestionsReady', {
        recipientId: application.candidate._id.toString(),
        jobTitle: job.title,
        questionCount: questions.length
      });
    }

    // notify via notification system
    createNotification(
      application.candidate._id,
      'ai_scored',
      'Interview Prep Questions Ready',
      `Your personalized interview questions for ${job.title} are ready. Start preparing!`,
      { jobId: job._id, applicationId }
    );

    console.log('Interview questions auto-generated for:', applicationId);

  } catch (err) {
    console.error('triggerInterviewGeneration error:', err.message);
  }
};
