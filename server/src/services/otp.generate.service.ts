import { OtpDocument } from "../types/otp";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { sendOTPEmail } from "./email.service";
import { IOtpRepository } from "../interfaces/repository-interface/otp-repository.interface";
import { Types } from "mongoose";
import { IOtpService } from "../interfaces/services-interface/otp-service.interface";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export class OtpService implements IOtpService {
  constructor(private otpRepository: IOtpRepository) {}

  async generateAndSendOtp(
    userId: string,
    email: string
  ): Promise<OtpDocument> {
    const objectId = new Types.ObjectId(userId);

    await this.otpRepository.deleteManyByUserId(objectId);
    const otp = generateOTP();
    console.log(`\n\n[OTP GENERATED] UserId: ${userId} | Email: ${email} | OTP: ${otp}\n\n`);
    const otpDoc = await this.otpRepository.create({
      userId: objectId,
      email,
      otp,
    });
    await sendOTPEmail(email, otp);
    return otpDoc;
  }

  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const objectId = new Types.ObjectId(userId);

    const otpDoc = await this.otpRepository.findByUserIdAndOtp(objectId, otp);
    if (!otpDoc) {
      throw new AppError(ERROR_MESSAGES.INVALID_OTP, StatusCode.BAD_REQUEST);
    }
    await this.otpRepository.deleteManyByUserId(objectId);
    return true;
  }

  async resendOtp(userId: string, email: string): Promise<void> {
    const objectId = new Types.ObjectId(userId);

    await this.otpRepository.deleteManyByUserId(objectId);
    const otp = generateOTP();
    console.log(`\n\n[OTP RESENT] UserId: ${userId} | Email: ${email} | OTP: ${otp}\n\n`);
    await this.otpRepository.create({ userId: objectId, email, otp });
    await sendOTPEmail(email, otp);
  }
}
