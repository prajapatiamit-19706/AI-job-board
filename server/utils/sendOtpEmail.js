import nodemailer from 'nodemailer';

export const sendOTPEmail = async (to, name, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"AI Job Board" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email — AI Job Board',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#09090B;font-family:'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#09090B;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:560px;background-color:#18181B;border-radius:16px;
                 border:1px solid #27272A;overflow:hidden;">

          <!-- TOP ACCENT BAR -->
          <tr>
            <td style="background:linear-gradient(90deg,#7C3AED,#A78BFA);
                        height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding:32px 40px 24px;">
              <!-- Logo -->
              <div style="display:inline-block;background:#7C3AED22;
                          border:1px solid #7C3AED44;border-radius:12px;
                          padding:10px 20px;margin-bottom:20px;">
                <span style="color:#A78BFA;font-size:14px;font-weight:700;
                             letter-spacing:0.05em;">⚡ AI Job Board</span>
              </div>

              <!-- Heading -->
              <h1 style="margin:0;color:#FAFAFA;font-size:24px;
                          font-weight:700;letter-spacing:-0.02em;">
                Verify your email
              </h1>
              <p style="margin:10px 0 0;color:#71717A;font-size:14px;
                         line-height:1.6;">
                Hi <span style="color:#A78BFA;font-weight:500;">${name}</span>,
                welcome to AI Job Board! Enter the code below
                to verify your email address and activate your account.
              </p>
            </td>
          </tr>

          <!-- OTP BOX -->
          <tr>
            <td align="center" style="padding:0 40px 32px;">
              <div style="background:#09090B;border:1px solid #27272A;
                          border-radius:16px;padding:32px 24px;
                          text-align:center;">

                <!-- Label -->
                <p style="margin:0 0 16px;color:#52525B;font-size:11px;
                           font-weight:600;letter-spacing:0.1em;
                           text-transform:uppercase;">
                  Your verification code
                </p>

                <!-- OTP digits -->
                <div style="display:inline-flex;gap:8px;margin-bottom:20px;">
                  ${otp.toString().split('').map(digit => `
                    <div style="width:48px;height:60px;background:#18181B;
                                border:1.5px solid #7C3AED;border-radius:10px;
                                display:inline-block;line-height:60px;
                                text-align:center;font-size:28px;font-weight:700;
                                color:#A78BFA;margin:0 4px;">
                      ${digit}
                    </div>
                  `).join('')}
                </div>

                <!-- Expiry -->
                <div style="display:inline-block;background:#7C3AED18;
                            border:1px solid #7C3AED30;border-radius:99px;
                            padding:6px 16px;">
                  <span style="color:#A78BFA;font-size:12px;font-weight:500;">
                    ⏱ Expires in 10 minutes
                  </span>
                </div>
              </div>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#27272A;"></div>
            </td>
          </tr>

          <!-- SECURITY NOTE -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#FAEEDA22;border:1px solid #F59E0B30;
                              border-radius:12px;padding:16px;">
                    <p style="margin:0;color:#FCD34D;font-size:12px;
                               font-weight:600;margin-bottom:4px;">
                      🔐 Security Notice
                    </p>
                    <p style="margin:0;color:#71717A;font-size:12px;
                               line-height:1.6;">
                      Never share this code with anyone.
                      AI Job Board will never ask for your OTP via phone or chat.
                      If you didn't request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHAT'S NEXT -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 12px;color:#52525B;font-size:11px;
                         font-weight:600;letter-spacing:0.08em;
                         text-transform:uppercase;">
                What happens next
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border-spacing:0 8px;">

                <tr>
                  <td style="vertical-align:top;padding-right:12px;
                              padding-bottom:8px;">
                    <div style="width:24px;height:24px;background:#7C3AED22;
                                border:1px solid #7C3AED44;border-radius:50%;
                                text-align:center;line-height:24px;
                                font-size:11px;font-weight:700;color:#A78BFA;">
                      1
                    </div>
                  </td>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;color:#FAFAFA;font-size:13px;
                               font-weight:500;">Enter the code above</p>
                    <p style="margin:2px 0 0;color:#71717A;font-size:12px;">
                      Paste or type the 6-digit code on the verification page
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="vertical-align:top;padding-right:12px;
                              padding-bottom:8px;">
                    <div style="width:24px;height:24px;background:#7C3AED22;
                                border:1px solid #7C3AED44;border-radius:50%;
                                text-align:center;line-height:24px;
                                font-size:11px;font-weight:700;color:#A78BFA;">
                      2
                    </div>
                  </td>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;color:#FAFAFA;font-size:13px;
                               font-weight:500;">Account gets activated</p>
                    <p style="margin:2px 0 0;color:#71717A;font-size:12px;">
                      Your account is instantly unlocked after verification
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="vertical-align:top;padding-right:12px;">
                    <div style="width:24px;height:24px;background:#22C55E22;
                                border:1px solid #22C55E44;border-radius:50%;
                                text-align:center;line-height:24px;
                                font-size:11px;font-weight:700;color:#4ADE80;">
                      3
                    </div>
                  </td>
                  <td>
                    <p style="margin:0;color:#FAFAFA;font-size:13px;
                               font-weight:500;">Start applying to jobs</p>
                    <p style="margin:2px 0 0;color:#71717A;font-size:12px;">
                      Browse jobs and let AI match your resume instantly
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- BOTTOM ACCENT BAR -->
          <tr>
            <td style="background:linear-gradient(90deg,#7C3AED,#A78BFA);
                        height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:20px 40px;">
              <p style="margin:0;color:#3F3F46;font-size:11px;">
                © 2026 AI Job Board · Built with ⚡ MERN + Groq AI
              </p>
              <p style="margin:6px 0 0;color:#3F3F46;font-size:11px;">
                This is an automated message — please do not reply
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `
  }

  await transporter.sendMail(mailOptions)
}