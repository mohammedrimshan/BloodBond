import { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
  verifyOTP: RequestHandler;
  resendOTP: RequestHandler;
  login: RequestHandler;
  refreshToken: RequestHandler;
  logout: RequestHandler;
}
