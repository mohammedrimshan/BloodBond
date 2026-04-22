import { RequestHandler } from "express";

export interface IUserController {
  getDonors: RequestHandler;
  getProfile: RequestHandler;
  updateProfile: RequestHandler;
}
