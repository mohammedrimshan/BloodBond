import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { AppError } from "../utils/appError";
import { IAuthController } from "../interfaces/controller-interface/auth-controller.interface";
import { IAuthService } from "../interfaces/services-interface/auth-service.interface";

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body, res);
      res.status(StatusCode.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
        userId: user._id,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body;
      const user = await this.authService.verifyOtp(userId, otp, res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoUrl: user.photoUrl,
        },
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.resendOtp(email);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.OTP_RESENT,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password, res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoUrl: user.photoUrl,
        },
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const accessToken = req.cookies["x-access-token"];
      const refreshToken = req.cookies["x-refresh-token"];
      await this.authService.refreshToken(accessToken, refreshToken, res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TOKEN_VALID,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await this.authService.logout(req.user?.id, res);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
}
