import { RequestHandler } from "express";

export interface IUserController {
  getDonors: RequestHandler;
  getNearbyDonors: RequestHandler;
  getProfile: RequestHandler;
  updateProfile: RequestHandler;
  getPublicProfile: RequestHandler;
}
