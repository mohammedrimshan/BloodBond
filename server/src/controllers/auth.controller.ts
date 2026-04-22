import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { IAuthController } from "../interfaces/controller-interface/auth-controller.interface";
import { IAuthService } from "../interfaces/services-interface/auth-service.interface";
import { setCookies } from "../utils/helpers/setCookies.helper";

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.status(StatusCode.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      userId: user._id,
    });
  });

  verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp } = req.body;
    const { user, accessToken, refreshToken } = await this.authService.verifyOtp(userId, otp);
    
    setCookies(res, accessToken, refreshToken);
    
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        place: user.place,
        district: user.district,
        address: user.address,
        pincode: user.pincode,
        whatsappNumber: user.whatsappNumber,
        lastDonatedDate: user.lastDonatedDate,
        isEligible: user.isEligible,
        isVerified: user.isVerified,
      },
    });
  });

  resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.resendOtp(email);
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.OTP_RESENT,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.authService.login(email, password);
    
    setCookies(res, accessToken, refreshToken);
    
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        place: user.place,
        district: user.district,
        address: user.address,
        pincode: user.pincode,
        whatsappNumber: user.whatsappNumber,
        lastDonatedDate: user.lastDonatedDate,
        isEligible: user.isEligible,
        isVerified: user.isVerified,
      },
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const accessToken = req.cookies["x-access-token"];
    const refreshToken = req.cookies["x-refresh-token"];
    const result = await this.authService.refreshToken(accessToken, refreshToken);
    
    if (result) {
      setCookies(res, result.accessToken, result.refreshToken);
    }
    
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TOKEN_VALID,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.logout(req.user?.id);
    
    res.clearCookie("x-access-token");
    res.clearCookie("x-refresh-token");
    
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  });
}
