"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validator_middleware_1 = require("../middlewares/validator.middleware");
const register_zod_1 = require("../utils/validators/register.zod");
const otp_zod_1 = require("../utils/validators/otp.zod");
const login_zod_1 = require("../utils/validators/login.zod");
function authRoutes(authController) {
    const router = (0, express_1.Router)();
    router.post("/register", (0, validator_middleware_1.validate)(register_zod_1.registerUserSchema), (0, express_async_handler_1.default)(authController.register.bind(authController)));
    router.post("/login", (0, validator_middleware_1.validate)(login_zod_1.loginSchema), (0, express_async_handler_1.default)(authController.login.bind(authController)));
    router.post("/verify-otp", (0, validator_middleware_1.validate)(otp_zod_1.verifyOtpSchema), (0, express_async_handler_1.default)(authController.verifyOTP.bind(authController)));
    router.post("/resend-otp", (0, validator_middleware_1.validate)(otp_zod_1.createOtpSchema), (0, express_async_handler_1.default)(authController.resendOTP.bind(authController)));
    router.post("/refresh-token", (0, express_async_handler_1.default)(authController.refreshToken.bind(authController)));
    router.post("/logout", (0, express_async_handler_1.default)(authController.logout.bind(authController)));
    return router;
}
//# sourceMappingURL=auth.route.js.map