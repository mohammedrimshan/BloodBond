import { Types } from "mongoose";
import { z } from "zod";

export const createOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  userId: z
    .string()
    .nonempty("User ID is required")
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid User ID format",
    }),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});