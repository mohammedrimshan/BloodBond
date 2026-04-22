import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IAdminController } from "../interfaces/controller-interface/admin-controller.interface";
import { IAdminService } from "../interfaces/services-interface/admin-service.interface";
import { StatusCode } from "../../constants/statusCode";
import { SUCCESS_MESSAGES } from "../../constants/messages";

export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { admin, accessToken, refreshToken } = await this.adminService.login(email, password);

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

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ADMIN_LOGIN_SUCCESS,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await this.adminService.logout();
    
    res.clearCookie("x-admin-access-token");
    res.clearCookie("x-admin-refresh-token");
    
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ADMIN_LOGOUT_SUCCESS
    });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const bloodGroup = req.query.bloodGroup as string;
    const district = req.query.district as string;

    const result = await this.adminService.getAllUsers({ page, limit, search, bloodGroup, district });
    res.status(StatusCode.OK).json({ success: true, ...result });
  });

  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.adminService.getUserStats();
    res.status(StatusCode.OK).json({ success: true, stats });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.adminService.getUserById(req.params.id);
    res.status(StatusCode.OK).json({ success: true, user });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.adminService.updateUser(req.params.id, req.body);
    res.status(StatusCode.OK).json({ 
      success: true, 
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      user 
    });
  });

  toggleBlockUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.adminService.toggleBlockUser(req.params.id);
    res.status(StatusCode.OK).json({ 
      success: true, 
      message: user.isBlocked ? SUCCESS_MESSAGES.USER_BLOCKED : SUCCESS_MESSAGES.USER_UNBLOCKED,
      user 
    });
  });
}
