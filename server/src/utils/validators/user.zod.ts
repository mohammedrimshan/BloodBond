import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  photoUrl: z.string().url().optional(),
  photoPublicId: z.string().optional(),
  googleId: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  place: z.string().optional(),
  lastDonatedDate: z.string().optional(),
  whatsappNumber: z.string().optional(),
  isEligible: z.boolean().optional(),
  refreshToken: z.string().optional(),
});
