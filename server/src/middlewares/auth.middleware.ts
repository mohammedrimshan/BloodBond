import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt.service";
import { UserModel } from "../models/user.model";

export interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies["x-access-token"];

    if (!token) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_MISSING });
      return;
    }

    const decoded = verifyAccessToken(token);

    // Check if user is blocked
    const user = await UserModel.findById(decoded.id).select("isBlocked");
    if (user?.isBlocked) {
      res.status(StatusCode.FORBIDDEN).json({ 
        success: false, 
        message: ERROR_MESSAGES.USER_IS_BLOCKED,
        forceLogout: true 
      });
      return;
    }

    (req as CustomRequest).user = decoded;
    next();
  } catch (error) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
  }
};
