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
