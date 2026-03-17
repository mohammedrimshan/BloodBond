import { Request, Response, NextFunction } from "express";

export interface IUserController {
  getDonors(req: Request, res: Response, next: NextFunction): Promise<void>;
}
