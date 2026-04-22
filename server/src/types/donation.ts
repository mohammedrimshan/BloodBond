import { Types } from "mongoose";

export interface IDonation {
  userId: Types.ObjectId;
  donatedAt: Date;
  nextEligibleDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
