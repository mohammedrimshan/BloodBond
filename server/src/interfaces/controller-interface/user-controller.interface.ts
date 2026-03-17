import { Request, Response, NextFunction } from "express";

export interface IUserController {
  getDonors(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
