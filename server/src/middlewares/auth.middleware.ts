import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt.service";

export interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["x-access-token"];

    if (!token) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_MISSING });
      return;
    }

    const decoded = verifyAccessToken(token);

    (req as CustomRequest).user = decoded;
    next();
  } catch (error) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
  }
};
