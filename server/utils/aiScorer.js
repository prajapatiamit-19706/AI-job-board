import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const scoreResume = async (resumeText, jobTitle, jobDescription, jobSkills = []) => {
  try {
    const truncatedResume = resumeText.substring(0, 3000);
    const skillsString = jobSkills.join(', ');

    const systemPrompt = `You are an expert technical recruiter and resume analyst. Your job is to evaluate how well
a candidate's resume matches a job posting. You must always respond with valid JSON only.
No explanation, no markdown, no code blocks. Only raw JSON.`;

    const userPrompt = `Analyze this resume against the job posting and return a JSON object with exactly
these fields:
{
  "score": <integer 0-100 representing overall match percentage>,
  "summary": "<2 sentences max: first sentence states the match quality, second gives the key reason>",
  "skillsMatched": ["<skill1>", "<skill2>", ...],
  "skillsMissing": ["<skill1>", "<skill2>", ...],
  "experienceMatch": "<strong|moderate|weak>",
  "recommendation": "<hire|consider|reject>"
}

Scoring guide:
- 85-100: Excellent match, candidate meets almost all requirements
- 70-84: Good match, meets most requirements with minor gaps
- 50-69: Moderate match, meets some requirements but notable gaps
- 30-49: Weak match, significant skill gaps
- 0-29: Poor match, does not meet core requirements

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS: ${skillsString}

CANDIDATE RESUME:
${truncatedResume}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const responseText = response.content[0].text;
    const parsed = JSON.parse(responseText.trim());

    if (typeof parsed.score !== 'number') {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error scoring resume:', error);
    return null;
  }
};
