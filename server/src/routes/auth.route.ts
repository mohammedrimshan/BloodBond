import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validate } from "../middlewares/validator.middleware";
import { registerUserSchema } from "../utils/validators/register.zod";
import { createOtpSchema, verifyOtpSchema } from "../utils/validators/otp.zod";
import { loginSchema } from "../utils/validators/login.zod";
import { IAuthController } from "../interfaces/controller-interface/auth-controller.interface";

export default function authRoutes(authController: IAuthController): Router {
  const router = Router();

  router.post("/register", validate(registerUserSchema), asyncHandler(authController.register.bind(authController)));
  router.post("/login", validate(loginSchema), asyncHandler(authController.login.bind(authController)));
  router.post("/verify-otp", validate(verifyOtpSchema), asyncHandler(authController.verifyOTP.bind(authController)));
  router.post("/resend-otp", validate(createOtpSchema), asyncHandler(authController.resendOTP.bind(authController)));
  router.post("/refresh-token", asyncHandler(authController.refreshToken.bind(authController)));
  router.post("/logout", asyncHandler(authController.logout.bind(authController)));

  return router;
}