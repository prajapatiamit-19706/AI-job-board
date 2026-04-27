import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const scoreResume = async (
  resumeText,
  jobTitle,
  jobDescription,
  jobSkills
) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter and resume analyst. You must always respond with valid JSON only. No explanation, no markdown, no code blocks. Only raw JSON.",
        },
        {
          role: "user",
          content: `Analyze this resume against the job posting and return a JSON object with exactly these fields:
{
  "score": <integer 0-100>,
  "summary": "<2 sentences: first states match quality, second gives key reason>",
  "skillsMatched": ["skill1", "skill2"],
  "skillsMissing": ["skill1", "skill2"],
  "experienceMatch": "<strong|moderate|weak>",
  "recommendation": "<hire|consider|reject>"
}

Scoring guide:
- 85-100: Excellent match
- 70-84:  Good match
- 50-69:  Moderate match
- 30-49:  Weak match
- 0-29:   Poor match

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS: ${jobSkills.join(", ")}

CANDIDATE RESUME:
${resumeText.slice(0, 3000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) return null;

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.score !== "number") return null;

    return parsed;
  } catch (error) {
    console.error("Groq scoring error:", error.message);
    return null;
  }
};