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
