"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phoneNumber: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    photoUrl: zod_1.z.string().url().optional(),
    photoPublicId: zod_1.z.string().optional(),
    googleId: zod_1.z.string().optional(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    dateOfBirth: zod_1.z.string().optional(),
    bloodGroup: zod_1.z.string().optional(),
    place: zod_1.z.string().optional(),
    lastDonatedDate: zod_1.z.string().optional(),
    whatsappNumber: zod_1.z.string().optional(),
    isEligible: zod_1.z.boolean().optional(),
    refreshToken: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.zod.js.map