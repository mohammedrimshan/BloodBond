import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  photoPublicId?: string;
  googleId?: string;
  isVerified?: boolean;
  password?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  place?: string;
  lastDonatedDate?: Date;
  whatsappNumber?: string;
  address?: string;
  pincode?: string;
  district?: string;
  isEligible?: boolean;
  isBlocked?: boolean;
  role?: "user" | "admin";
  createdAt?: Date;
  refreshToken?: string;
}

export interface UserDocument extends Document<Types.ObjectId>, IUser {}
