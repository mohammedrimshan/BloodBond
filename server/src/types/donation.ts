import { Types } from "mongoose";

export interface IDonation {
  userId: Types.ObjectId;
  donatedAt: Date;
  nextEligibleDate: Date;
  isEmergency?: boolean;
  emergencyId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
