"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const messages_1 = require("../constants/messages");
const statusCode_1 = require("../constants/statusCode");
const appError_1 = require("../utils/appError");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res) {
        try {
            const user = await this.authService.register(req.body, res);
            res.status(statusCode_1.StatusCode.CREATED).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
                userId: user._id,
            });
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                res
                    .status(error.statusCode)
                    .json({ success: false, message: error.message });
            }
            else {
                res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        }
    }
    async verifyOTP(req, res) {
        try {
            const { userId, otp } = req.body;
            const user = await this.authService.verifyOtp(userId, otp, res);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.EMAIL_VERIFIED,
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
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                res
                    .status(error.statusCode)
                    .json({ success: false, message: error.message });
            }
            else {
                res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        }
    }
    async resendOTP(req, res) {
        try {
            const { email } = req.body;
            await this.authService.resendOtp(email);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.OTP_RESENT,
            });
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                res
                    .status(error.statusCode)
                    .json({ success: false, message: error.message });
            }
            else {
                res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.authService.login(email, password, res);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
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
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                res
                    .status(error.statusCode)
                    .json({ success: false, message: error.message });
            }
            else {
                res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        }
    }
    async refreshToken(req, res) {
        try {
            const accessToken = req.cookies["x-access-token"];
            const refreshToken = req.cookies["x-refresh-token"];
            await this.authService.refreshToken(accessToken, refreshToken, res);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.TOKEN_VALID,
            });
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                res
                    .status(error.statusCode)
                    .json({ success: false, message: error.message });
            }
            else {
                res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        }
    }
    async logout(req, res) {
        try {
            await this.authService.logout(req.user?.id, res);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
            });
        }
        catch (error) {
            res.status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: messages_1.ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map