"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = require("../utils/appError");
const messages_1 = require("../constants/messages");
const statusCode_1 = require("../constants/statusCode");
const jwt_service_1 = require("./jwt.service");
const setCookies_helper_1 = require("../utils/helpers/setCookies.helper");
class AuthService {
    constructor(userRepository, otpRepository, otpService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.otpService = otpService;
    }
    async register(data, res) {
        console.log("AuthService - Input data:", {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            photoUrl: data.photoUrl || "Missing",
            lastDonatedDate: data.lastDonatedDate,
        });
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new appError_1.AppError("Email already exists", statusCode_1.StatusCode.CONFLICT);
        }
        if (data.photoUrl) {
            const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
            if (!urlRegex.test(data.photoUrl)) {
                throw new appError_1.AppError("Invalid photo URL format", statusCode_1.StatusCode.BAD_REQUEST);
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
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
            throw new appError_1.AppError("Failed to create user", statusCode_1.StatusCode.INTERNAL_SERVER_ERROR);
        }
        await this.otpService.generateAndSendOtp(user._id.toString(), user.email);
        return user;
    }
    async verifyOtp(userId, otp, res) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.USER_NOT_FOUND, statusCode_1.StatusCode.NOT_FOUND);
        }
        if (user.isVerified) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, statusCode_1.StatusCode.BAD_REQUEST);
        }
        await this.otpService.verifyOtp(userId, otp);
        const updatedUser = await this.userRepository.update(userId, {
            isVerified: true,
        });
        if (!updatedUser) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.SERVER_ERROR, statusCode_1.StatusCode.INTERNAL_SERVER_ERROR);
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
        };
        const accessToken = (0, jwt_service_1.createAccessToken)(payload);
        const refreshToken = (0, jwt_service_1.createRefreshToken)(payload);
        await this.userRepository.update(userId, { refreshToken });
        (0, setCookies_helper_1.setCookies)(res, accessToken, refreshToken);
        return updatedUser;
    }
    async resendOtp(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return;
        }
        if (user.isVerified) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, statusCode_1.StatusCode.BAD_REQUEST);
        }
        await this.otpService.resendOtp(user._id.toString(), user.email);
    }
    async login(email, password, res) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS, statusCode_1.StatusCode.BAD_REQUEST);
        }
        if (!user.isVerified) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.EMAIL_NOT_VERIFIED, statusCode_1.StatusCode.BAD_REQUEST);
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS, statusCode_1.StatusCode.BAD_REQUEST);
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
        };
        const accessToken = (0, jwt_service_1.createAccessToken)(payload);
        const refreshToken = (0, jwt_service_1.createRefreshToken)(payload);
        await this.userRepository.update(user._id.toString(), { refreshToken });
        (0, setCookies_helper_1.setCookies)(res, accessToken, refreshToken);
        return user;
    }
    async refreshToken(accessToken, refreshToken, res) {
        if (!refreshToken) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.TOKEN_MISSING, statusCode_1.StatusCode.UNAUTHORIZED);
        }
        let shouldRefresh = false;
        try {
            (0, jwt_service_1.verifyAccessToken)(accessToken);
            return;
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                shouldRefresh = true;
            }
            else {
                throw new appError_1.AppError(messages_1.ERROR_MESSAGES.TOKEN_INVALID, statusCode_1.StatusCode.UNAUTHORIZED);
            }
        }
        if (shouldRefresh) {
            const decoded = (0, jwt_service_1.verifyRefreshToken)(refreshToken);
            const user = await this.userRepository.findById(decoded.id);
            if (!user || user.refreshToken !== refreshToken) {
                throw new appError_1.AppError(messages_1.ERROR_MESSAGES.TOKEN_INVALID_REUSED, statusCode_1.StatusCode.UNAUTHORIZED);
            }
            const payload = {
                id: user._id.toString(),
                email: user.email,
            };
            const newAccessToken = (0, jwt_service_1.createAccessToken)(payload);
            const newRefreshToken = (0, jwt_service_1.createRefreshToken)(payload);
            await this.userRepository.update(user._id.toString(), {
                refreshToken: newRefreshToken,
            });
            (0, setCookies_helper_1.setCookies)(res, newAccessToken, newRefreshToken);
        }
    }
    async logout(userId, res) {
        const user = await this.userRepository.findById(userId);
        if (user) {
            await this.userRepository.update(userId, { refreshToken: undefined });
        }
        res.clearCookie("x-access-token");
        res.clearCookie("x-refresh-token");
    }
    async getMe(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.USER_NOT_FOUND, statusCode_1.StatusCode.NOT_FOUND);
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map