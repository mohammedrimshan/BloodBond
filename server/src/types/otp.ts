import { Document, Types } from "mongoose";

export interface IOtp {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
}

export interface OtpDocument extends Document, IOtp {}
