import { Response } from "express";
import { UserDocument } from "../../types/user";
export interface IAuthService {
  register(
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      password: string;
      photoBase64?: string;
    },
    res: Response
  ): Promise<UserDocument>;

  verifyOtp(userId: string, otp: string, res: Response): Promise<UserDocument>;

  resendOtp(email: string): Promise<void>;

  login(email: string, password: string, res: Response): Promise<UserDocument>;

  refreshToken(accessToken: string, refreshToken: string, res: Response): Promise<void>;

  logout(userId: string, res: Response): Promise<void>;

  getMe(userId: string): Promise<UserDocument>;
}
