import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AdminJwtPayload } from "../types/admin";

dotenv.config();

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin_secret";
const ADMIN_JWT_REFRESH_SECRET = process.env.ADMIN_JWT_REFRESH_SECRET || "admin_refresh_secret";

export const createAdminAccessToken = (payload: AdminJwtPayload): string => {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: "15m" });
};

export const createAdminRefreshToken = (payload: AdminJwtPayload): string => {
  return jwt.sign(payload, ADMIN_JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAdminAccessToken = (token: string): AdminJwtPayload => {
  return jwt.verify(token, ADMIN_JWT_SECRET) as AdminJwtPayload;
};

export const verifyAdminRefreshToken = (token: string): AdminJwtPayload => {
  return jwt.verify(token, ADMIN_JWT_REFRESH_SECRET) as AdminJwtPayload;
};
