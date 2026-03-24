import bcrypt from "bcrypt";
import { Response } from "express";
import { UserModel } from "../../models/user.model";
import { UserDocument, IUser } from "../../types/user";
import { AdminJwtPayload } from "../../types/admin";
import { AppError } from "../../utils/appError";
import { ERROR_MESSAGES } from "../../constants/messages";
import { StatusCode } from "../../constants/statusCode";
import {
  createAdminAccessToken,
  createAdminRefreshToken,
} from "../../services/admin.jwt.service";
import {
  GetUsersQuery,
  PaginatedUsers,
  UserStats,
} from "../interfaces/repository-interface/admin-repository.interface";
import { IAdminService } from "../interfaces/services-interface/admin-service.interface";
import { IAdminRepository } from "../interfaces/repository-interface/admin-repository.interface";

export class AdminService implements IAdminService {
  constructor(private adminRepository: IAdminRepository) {}

  async login(email: string, password: string, res: Response): Promise<UserDocument> {
    const user = await UserModel.findOne({ email, role: "admin" });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_ADMIN_CREDENTIALS, StatusCode.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.INVALID_ADMIN_CREDENTIALS, StatusCode.UNAUTHORIZED);
    }

    const payload: AdminJwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: "admin",
    };

    const accessToken = createAdminAccessToken(payload);
    const refreshToken = createAdminRefreshToken(payload);

    res.cookie("x-admin-access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("x-admin-refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie("x-admin-access-token");
    res.clearCookie("x-admin-refresh-token");
  }

  async getAllUsers(query: GetUsersQuery): Promise<PaginatedUsers> {
    return this.adminRepository.getAllUsers(query);
  }

  async getUserStats(): Promise<UserStats> {
    return this.adminRepository.getUserStats();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.adminRepository.getUserById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<UserDocument> {
    const user = await this.adminRepository.updateUserById(id, data);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }

  async toggleBlockUser(id: string): Promise<UserDocument> {
    const user = await this.adminRepository.toggleBlockUser(id);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }
}
