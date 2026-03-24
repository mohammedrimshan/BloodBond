import { Request, Response } from "express";
import { IAdminController } from "../interfaces/controller-interface/admin-controller.interface";
import { IAdminService } from "../interfaces/services-interface/admin-service.interface";
import { StatusCode } from "../../constants/statusCode";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants/messages";
import { AppError } from "../../utils/appError";

export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.adminService.login(email, password, res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADMIN_LOGIN_SUCCESS,
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.adminService.logout(res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADMIN_LOGOUT_SUCCESS
      });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const bloodGroup = req.query.bloodGroup as string;
      const district = req.query.district as string;

      const result = await this.adminService.getAllUsers({ page, limit, search, bloodGroup, district });
      res.status(StatusCode.OK).json({ success: true, ...result });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.adminService.getUserStats();
      res.status(StatusCode.OK).json({ success: true, stats });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.adminService.getUserById(req.params.id);
      res.status(StatusCode.OK).json({ success: true, user });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.adminService.updateUser(req.params.id, req.body);
      res.status(StatusCode.OK).json({ 
        success: true, 
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        user 
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }

  async toggleBlockUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.adminService.toggleBlockUser(req.params.id);
      res.status(StatusCode.OK).json({ 
        success: true, 
        message: user.isBlocked ? SUCCESS_MESSAGES.USER_BLOCKED : SUCCESS_MESSAGES.USER_UNBLOCKED,
        user 
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }
}
