"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_service_1 = __importDefault(require("./nodemailer.service"));
const sendOTPEmail = async (email, otp) => {
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
    await nodemailer_service_1.default.sendMail(mailOptions);
};
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=email.service.js.map