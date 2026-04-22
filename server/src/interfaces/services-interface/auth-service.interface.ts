import { UserDocument } from "../../types/user";
export interface IAuthService {
  register(
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      password: string;
      photoBase64?: string;
    }
  ): Promise<UserDocument>;

  verifyOtp(userId: string, otp: string): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }>;

  resendOtp(email: string): Promise<void>;

  login(email: string, password: string): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }>;

  refreshToken(accessToken: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | void>;

  logout(userId: string): Promise<void>;

  getMe(userId: string): Promise<UserDocument>;
}
