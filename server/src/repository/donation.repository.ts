import { DonationModel, DonationDocument } from "../models/donation.model";
import { UserModel } from "../models/user.model";
import { IDonation } from "../types/donation";
import { Types } from "mongoose";

export class DonationRepository {
  async createDonation(data: IDonation): Promise<DonationDocument> {
    const donation = new DonationModel(data);
    return await donation.save();
  }

  async findByUserId(userId: string): Promise<DonationDocument[]> {
    return (await DonationModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ donatedAt: -1 })
      .lean()) as unknown as DonationDocument[];
  }

  async findRecent(limit: number): Promise<any[]> {
    return (await DonationModel.find()
      .populate("userId", "name bloodGroup photoUrl")
      .sort({ donatedAt: -1 })
      .limit(limit)
      .lean()) as any[];
  }

  async findAll(page: number, limit: number): Promise<{ donations: DonationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [donations, total] = await Promise.all([
      DonationModel.find()
        .populate("userId", "name email bloodGroup")
        .sort({ donatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DonationModel.countDocuments(),
    ]);

    return { 
      donations: donations as unknown as DonationDocument[], 
      total 
    };
  }

  async updateUserInfoAfterDonation(userId: string, date: Date, nextDate: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      lastDonatedDate: date,
      isEligible: false,
    });
  }
}
