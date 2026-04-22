import bcrypt from "bcrypt";
import { UserDocument } from "../types/user";
import { CustomJwtPayload } from "../types/auth";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt.service";
import { OtpService } from "./otp.generate.service";
import { IOtpRepository } from "../interfaces/repository-interface/otp-repository.interface";
import { IAuthService } from "../interfaces/services-interface/auth-service.interface";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private otpService: OtpService
  ) {}

  async register(
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      password: string;
      photoUrl?: string;
      dateOfBirth?: string;
      bloodGroup?: string;
      place?: string;
      lastDonatedDate?: string;
    whatsappNumber?: string;
  }): Promise<UserDocument> {
    console.log("AuthService - Input data:", {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      photoUrl: data.photoUrl || "Missing",
      lastDonatedDate: data.lastDonatedDate,
    });

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already exists", StatusCode.CONFLICT);
    }

    if (data.photoUrl) {
      const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
      if (!urlRegex.test(data.photoUrl)) {
        throw new AppError("Invalid photo URL format", StatusCode.BAD_REQUEST);
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    let isEligible = true;
    if (data.lastDonatedDate) {
      const lastDonated = new Date(data.lastDonatedDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      isEligible = lastDonated <= threeMonthsAgo;
    }

    const userData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      photoUrl: data.photoUrl,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      bloodGroup: data.bloodGroup,
      place: data.place,
      lastDonatedDate: data.lastDonatedDate ? new Date(data.lastDonatedDate) : undefined,
      whatsappNumber: data.whatsappNumber,
      isEligible,
      photoPublicId: undefined,
      isVerified: false,
    };
    console.log("User data to create:", userData);
    const user = await this.userRepository.create(userData);
    console.log("User after create:", user);
    if (!user) {
      throw new AppError(
        "Failed to create user",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    await this.otpService.generateAndSendOtp(user._id.toString(), user.email);
    return user;
  }

  async verifyOtp(
    userId: string,
    otp: string
  ): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }

    await this.otpService.verifyOtp(userId, otp);
    const updatedUser = await this.userRepository.update(userId, {
      isVerified: true,
    });
    if (!updatedUser) {
      throw new AppError(
        ERROR_MESSAGES.SERVER_ERROR,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const payload: CustomJwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    await this.userRepository.update(userId, { refreshToken });

    return { user: updatedUser, accessToken, refreshToken };
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    if (user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }
    await this.otpService.resendOtp(user._id.toString(), user.email);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }
    if (!user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }
    if (user.isBlocked) {
      throw new AppError(
        ERROR_MESSAGES.USER_IS_BLOCKED,
        StatusCode.FORBIDDEN
      );
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }

    const payload: CustomJwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    await this.userRepository.update(user._id.toString(), { refreshToken });

    return { user, accessToken, refreshToken };
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | void> {
    if (!refreshToken) {
      throw new AppError(ERROR_MESSAGES.TOKEN_MISSING, StatusCode.UNAUTHORIZED);
    }

    let shouldRefresh = false;
    try {
      verifyAccessToken(accessToken);
      return;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        shouldRefresh = true;
      } else {
        throw new AppError(
          ERROR_MESSAGES.TOKEN_INVALID,
          StatusCode.UNAUTHORIZED
        );
      }
    }

    if (shouldRefresh) {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          ERROR_MESSAGES.TOKEN_INVALID_REUSED,
          StatusCode.UNAUTHORIZED
        );
      }

      const payload: CustomJwtPayload = {
        id: user._id.toString(),
        email: user.email,
      };
      const newAccessToken = createAccessToken(payload);
      const newRefreshToken = createRefreshToken(payload);
      await this.userRepository.update(user._id.toString(), {
        refreshToken: newRefreshToken,
      });
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.userRepository.update(userId, { refreshToken: undefined });
    }
  }

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return user;
  }
}
