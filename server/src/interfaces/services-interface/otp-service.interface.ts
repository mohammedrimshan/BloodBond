import { OtpDocument } from "../../types/otp";

export interface IOtpService {
  generateAndSendOtp(userId: string, email: string): Promise<OtpDocument>;
  verifyOtp(userId: string, otp: string): Promise<boolean>;
  resendOtp(userId: string, email: string): Promise<void>;
}