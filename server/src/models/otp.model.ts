import { Schema, model} from "mongoose";
import { OtpDocument } from "../types/otp";


const otpSchema = new Schema<OtpDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, 
    },
  },
  { timestamps: true }
);

export const OTPModel = model<OtpDocument>("OTP", otpSchema);
