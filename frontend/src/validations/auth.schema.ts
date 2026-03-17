import { z } from "zod";

// ─── Login Schema ────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Signup Schema ───────────────────────────────────────────
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dateOfBirth: z.string()
      .min(1, "Date of birth is required")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }, "You must be at least 18 years old"),
    bloodGroup: z.string().min(1, "Blood group is required"),
    place: z.string().min(1, "Place is required"),
    lastDonatedDate: z.string().optional(),
    whatsappNumber: z
      .string()
      .min(10, "WhatsApp number must be at least 10 digits")
      .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    photo: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// ─── OTP Schema ──────────────────────────────────────────────
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter full 6-digit OTP")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// ─── Update Profile Schema ────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const actualAge = (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ? age - 1 : age;
      return actualAge >= 18;
    }, "You must be at least 18 years old"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  place: z.string().min(1, "Place is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  pincode: z.string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),
  whatsappNumber: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  lastDonatedDate: z.string().optional().or(z.literal("")),
  profileImage: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
