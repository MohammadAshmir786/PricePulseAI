import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetOTP(to, otp) {
  const appName = process.env.APP_NAME || "PricePulseAI";
  const from = `PricePulseAI <no-reply@example.com>`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b1020; font-family: 'Space Grotesk', 'Segoe UI', system-ui, -apple-system, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #111831 0%, #0b1020 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);">
              <!-- Header with gradient -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #ff7b5f 0%, #2d7ff9 100%);">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    🔐 ${appName}
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #f7f9ff; font-size: 24px; font-weight: 600;">
                    Password Reset Request
                  </h2>
                  <p style="margin: 0 0 30px; color: #9fb0d1; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Use the code below to proceed:
                  </p>
                  
                  <!-- OTP Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td style="background: rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 30px; text-align: center; border: 2px solid rgba(255, 123, 95, 0.3);">
                        <p style="margin: 0 0 10px; color: #9fb0d1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Your Verification Code
                        </p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #ff7b5f 0%, #2d7ff9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                          ${otp}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Info Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0;">
                    <tr>
                      <td style="background: rgba(45, 127, 249, 0.1); border-left: 4px solid #2d7ff9; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; color: #9fb0d1; font-size: 14px; line-height: 1.6;">
                          ⏱️ <strong style="color: #f7f9ff;">This code expires in 10 minutes.</strong><br/>
                          🔒 For security, never share this code with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 25px 0 0; color: #9fb0d1; font-size: 14px; line-height: 1.6;">
                    If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background: rgba(255, 255, 255, 0.03); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                  <p style="margin: 0 0 10px; color: #9fb0d1; font-size: 14px; text-align: center;">
                    Stay secure with ${appName}
                  </p>
                  <p style="margin: 0; color: #4a5670; font-size: 12px; text-align: center; line-height: 1.5;">
                    © ${new Date().getFullYear()} ${appName}. All rights reserved.<br/>
                    This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `${appName} - Your Password Reset OTP`,
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

  // const previewUrl = nodemailer.getTestMessageUrl(info);
  // if (previewUrl) {
  //   console.log("Ethereal preview URL:", previewUrl);
  // }

  // return info;
}
