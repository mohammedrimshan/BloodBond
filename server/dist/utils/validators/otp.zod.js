"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.createOtpSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.verifyOtpSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .nonempty("User ID is required")
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid User ID format",
    }),
    otp: zod_1.z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});
//# sourceMappingURL=otp.zod.js.map