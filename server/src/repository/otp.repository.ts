import { BaseRepository } from "./base.respository";
import { OTPModel } from "../models/otp.model";
import { OtpDocument } from "../types/otp";
import { IOtpRepository } from "../interfaces/repository-interface/otp-repository.interface";
import { Types } from "mongoose";

export class OtpRepository
  extends BaseRepository<OtpDocument>
  implements IOtpRepository
{
  constructor() {
    super(OTPModel);
  }

  async findByUserIdAndOtp(
    userId: Types.ObjectId,
    otp: string
  ): Promise<OtpDocument | null> {
    return this.model.findOne({ userId, otp }).exec();
  }

  async deleteManyByUserId(userId: Types.ObjectId): Promise<void> {
    await this.model.deleteMany({ userId }).exec();
  }
}
