"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_zod_1 = require("./user.zod");
exports.registerUserSchema = user_zod_1.userSchema.extend({
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password must not exceed 32 characters"),
    photoBase64: zod_1.default
        .string()
        .optional()
        .refine((val) => !val || val.match(/^data:image\/[a-z]+;base64,/), "Photo must be a valid base64 image string"),
    dateOfBirth: zod_1.default.string().optional(),
    bloodGroup: zod_1.default.string().optional(),
    place: zod_1.default.string().optional(),
    lastDonatedDate: zod_1.default.string().optional(),
    whatsappNumber: zod_1.default.string().optional(),
});
//# sourceMappingURL=register.zod.js.map