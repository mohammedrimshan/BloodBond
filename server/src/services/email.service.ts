import transporter from "./nodemailer.service";

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"QuickLink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 2px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendReminderEmail = async (email: string, name: string): Promise<void> => {
  const mailOptions = {
    from: `"BloodBond" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "You are a Hero Again! 🩸",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Time to Save Lives!</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #333;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>It's been 3 months since your last donation. This means you are now <strong>eligible to donate blood again!</strong></p>
          <p>Your previous contribution made a real difference, and today, someone might be waiting for a hero like you.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ALLOWED_ORIGIN}/profile" style="background-color: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Your Status</a>
          </div>
          <p>Thank you for being a part of the BloodBond community.</p>
          <p>Best regards,<br>The BloodBond Team</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          <p>If you have already donated recently elsewhere, please update your profile to stay eligible.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

