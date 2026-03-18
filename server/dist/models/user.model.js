"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    photoUrl: String,
    photoPublicId: String,
    isVerified: { type: Boolean, default: false },
    googleId: String,
    password: String,
    dateOfBirth: Date,
    bloodGroup: String,
    place: String,
    lastDonatedDate: Date,
    whatsappNumber: String,
    address: String,
    pincode: String,
    district: String,
    isEligible: { type: Boolean, default: true },
    refreshToken: String,
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map