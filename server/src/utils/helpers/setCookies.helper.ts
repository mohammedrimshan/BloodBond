import { Response } from "express";

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("x-access-token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });

  res.cookie("x-refresh-token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
};
