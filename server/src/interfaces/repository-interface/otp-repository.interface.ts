import { OtpDocument } from "../../types/otp";
import { Types } from "mongoose";
import { IBaseRepository } from "./base-repository.interface";

export interface IOtpRepository extends IBaseRepository<OtpDocument> {
  findByUserIdAndOtp(userId: Types.ObjectId, otp: string): Promise<OtpDocument | null>;
  deleteManyByUserId(userId: Types.ObjectId): Promise<void>;
}