import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendStatusEmail = async (to, candidateName, jobTitle, status) => {
  try {
    const statusDetails = {
      applied: { color: '#3B82F6', text: 'Applied' },
      shortlisted: { color: '#8B5CF6', text: 'Shortlisted' },
      interview: { color: '#F59E0B', text: 'Interview' },
      rejected: { color: '#EF4444', text: 'Rejected' },
      hired: { color: '#10B981', text: 'Hired' },
    };

    const currentStatus = statusDetails[status];

    let message = '';
    switch (status) {
      case 'shortlisted':
        message = "Congratulations! You've been shortlisted 🎉";
        break;
      case 'interview':
        message = "Great news! You've been selected for an interview 📅";
        break;
      case 'rejected':
        message = "Thank you for applying. Unfortunately you weren't selected this time.";
        break;
      case 'hired':
        message = 'Congratulations! You got the job! 🚀';
        break;
      default:
        message = 'Your application status has been updated.';
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Your application status has been updated — ${jobTitle}`,
      html: `
        <div style="background-color: #09090B; padding: 40px; font-family: sans-serif; color: #FFFFFF;">
          <div style="background-color: #18181B; max-width: 600px; margin: 0 auto; border-radius: 12px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <h2 style="color: #7C3AED; margin-top: 0;">Application Update</h2>
            <p style="font-size: 16px; color: #A1A1AA;">Hi ${candidateName},</p>
            <p style="font-size: 16px; color: #A1A1AA;">Your application for <strong>${jobTitle}</strong> has a new status.</p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: rgba(${hexToRgb(currentStatus.color)}, 0.1); border: 1px solid rgba(${hexToRgb(currentStatus.color)}, 0.2); border-radius: 8px; text-align: center;">
              <span style="color: ${currentStatus.color}; font-weight: bold; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                ${currentStatus.text}
              </span>
            </div>
            
            <p style="font-size: 16px; color: #E4E4E7; font-weight: 500;">${message}</p>
            
            <hr style="border-color: rgba(255, 255, 255, 0.1); margin: 30px 0;" />
            <p style="font-size: 14px; color: #71717A;">This is an automated message from the AI Job Board.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending status email:', error);
  }
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '124, 58, 237';
}

export const sendInterviewEmail = async (candidate, jobTitle, groupedQuestions, aiScore) => {
  try {
    let categoriesHtml = '';

    ['technical', 'behavioral', 'gap-based'].forEach(cat => {
      const questions = groupedQuestions[cat] || [];
      if (questions.length === 0) return;

      let catColor = '';
      let catBg = '';
      if (cat === 'technical') {
        catBg = '#7C3AED22'; catColor = '#7C3AED';
      } else if (cat === 'behavioral') {
        catBg = '#3B82F622'; catColor = '#3B82F6';
      } else {
        catBg = '#F59E0B22'; catColor = '#F59E0B';
      }

      categoriesHtml += `
        <div style="margin-top: 24px;">
          <div style="background-color: ${catBg}; border-left: 3px solid ${catColor}; padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: ${catColor}; font-weight: bold; text-transform: uppercase; font-size: 12px;">${cat}</span>
            <span style="color: #71717A; font-size: 12px;">${questions.length} Questions</span>
          </div>
          <div style="margin-top: 12px;">
      `;

      questions.forEach((q, idx) => {
        let diffBg = '';
        let diffColor = '';
        if (q.difficulty === 'easy') { diffBg = '#22C55E22'; diffColor = '#4ADE80'; }
        else if (q.difficulty === 'medium') { diffBg = '#F59E0B22'; diffColor = '#FCD34D'; }
        else { diffBg = '#EF444422'; diffColor = '#F87171'; }

        categoriesHtml += `
          <div style="padding: 12px; margin: 8px 0; background-color: #18181B; border-radius: 8px;">
            <div style="display: flex; align-items: flex-start;">
              <span style="display: inline-block; background-color: #27272A; color: #A78BFA; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px; flex-shrink: 0;">${idx + 1}</span>
              <div>
                <p style="color: #FAFAFA; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">${q.question}</p>
                <span style="background-color: ${diffBg}; color: ${diffColor}; border-radius: 99px; padding: 2px 8px; font-size: 11px; text-transform: uppercase;">${q.difficulty}</span>
              </div>
            </div>
          </div>
        `;
      });
      categoriesHtml += `</div></div>`;
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: `Interview Preparation Questions — ${jobTitle}`,
      html: `
        <div style="background-color: #09090B; padding: 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #18181B; border-bottom: 2px solid #7C3AED; padding: 24px; border-radius: 8px 8px 0 0;">
            <p style="color: #A78BFA; font-size: 12px; margin: 0 0 4px 0;">AI Job Board</p>
            <h2 style="color: #FAFAFA; font-size: 22px; font-weight: bold; margin: 0 0 8px 0;">Your Interview Preparation Guide</h2>
            <p style="color: #A78BFA; font-size: 14px; margin: 0;">${jobTitle}</p>
          </div>
          
          <div style="background-color: #18181B; padding: 24px; margin-top: 8px; border-radius: 4px;">
            <p style="color: #FAFAFA; margin: 0 0 12px 0;">Hi ${candidate.name},</p>
            <p style="color: #71717A; margin: 0 0 20px 0; line-height: 1.5;">Congratulations! The employer has shared these AI-generated interview preparation questions to help you prepare for your ${jobTitle} interview.</p>
            ${aiScore ? `<span style="background-color: #7C3AED22; border: 1px solid #7C3AED44; color: #A78BFA; border-radius: 99px; padding: 4px 12px; display: inline-block; font-size: 13px;">Your AI Match Score: ${aiScore}/100</span>` : ''}
            
            ${categoriesHtml}
          </div>
          
          <div style="background-color: #18181B; padding: 16px; margin-top: 8px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #52525B; font-size: 12px; margin: 0 0 8px 0;">This is an AI-generated question set tailored specifically for you</p>
            <p style="color: #A78BFA; font-size: 14px; margin: 0 0 8px 0;">Good luck with your interview! 🚀</p>
            <p style="color: #7C3AED; font-size: 11px; margin: 0;">AI Job Board</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions); // Fire and forget
  } catch (error) {
    console.error('Error in sendInterviewEmail logic:', error);
  }
};
