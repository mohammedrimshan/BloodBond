import { RequestHandler } from "express";

export interface IAdminController {
  login: RequestHandler;
  logout: RequestHandler;
  getAllUsers: RequestHandler;
  getUserStats: RequestHandler;
  getUserById: RequestHandler;
  updateUser: RequestHandler;
  toggleBlockUser: RequestHandler;
}
