import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../constants/statusCode";
import { ERROR_MESSAGES } from "../constants/messages";
import { verifyAdminAccessToken } from "../services/admin.jwt.service";
import { AdminJwtPayload } from "../types/admin";

export interface AdminRequest extends Request {
  admin: AdminJwtPayload;
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["x-admin-access-token"];

    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        success: false, 
        message: ERROR_MESSAGES.TOKEN_MISSING 
      });
      return;
    }

    const decoded = verifyAdminAccessToken(token);
    
    if (decoded.role !== "admin") {
      res.status(StatusCode.FORBIDDEN).json({ 
        success: false, 
        message: ERROR_MESSAGES.FORBIDDEN 
      });
      return;
    }

    (req as AdminRequest).admin = decoded;
    next();
  } catch (error) {
    res.status(StatusCode.UNAUTHORIZED).json({ 
      success: false, 
      message: ERROR_MESSAGES.TOKEN_EXPIRED 
    });
  }
};
