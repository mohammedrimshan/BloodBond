import { Request, Response } from "express";

export interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getUserStats(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  toggleBlockUser(req: Request, res: Response): Promise<void>;
}
