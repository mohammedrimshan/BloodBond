import { StatusCode } from "../constants/statusCode";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: errors });
      return;
    }

    req.body = result.data;
    next();
  };
