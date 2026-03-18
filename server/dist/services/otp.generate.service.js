"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = exports.generateOTP = void 0;
const appError_1 = require("../utils/appError");
const messages_1 = require("../constants/messages");
const statusCode_1 = require("../constants/statusCode");
const email_service_1 = require("./email.service");
const mongoose_1 = require("mongoose");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
class OtpService {
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    async generateAndSendOtp(userId, email) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        await this.otpRepository.deleteManyByUserId(objectId);
        const otp = (0, exports.generateOTP)();
        console.log(`\n\n[OTP GENERATED] UserId: ${userId} | Email: ${email} | OTP: ${otp}\n\n`);
        const otpDoc = await this.otpRepository.create({
            userId: objectId,
            email,
            otp,
        });
        await (0, email_service_1.sendOTPEmail)(email, otp);
        return otpDoc;
    }
    async verifyOtp(userId, otp) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        const otpDoc = await this.otpRepository.findByUserIdAndOtp(objectId, otp);
        if (!otpDoc) {
            throw new appError_1.AppError(messages_1.ERROR_MESSAGES.INVALID_OTP, statusCode_1.StatusCode.BAD_REQUEST);
        }
        await this.otpRepository.deleteManyByUserId(objectId);
        return true;
    }
    async resendOtp(userId, email) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        await this.otpRepository.deleteManyByUserId(objectId);
        const otp = (0, exports.generateOTP)();
        console.log(`\n\n[OTP RESENT] UserId: ${userId} | Email: ${email} | OTP: ${otp}\n\n`);
        await this.otpRepository.create({ userId: objectId, email, otp });
        await (0, email_service_1.sendOTPEmail)(email, otp);
    }
}
exports.OtpService = OtpService;
//# sourceMappingURL=otp.generate.service.js.map