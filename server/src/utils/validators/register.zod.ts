import z from "zod";
import { userSchema } from "./user.zod";

export const registerUserSchema = userSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
  photoBase64: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.match(/^data:image\/[a-z]+;base64,/),
      "Photo must be a valid base64 image string"
    ),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  place: z.string().optional(),
  lastDonatedDate: z.string().optional(),
  whatsappNumber: z.string().optional(),
});
